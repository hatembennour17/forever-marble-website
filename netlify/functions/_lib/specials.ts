import { randomUUID } from "node:crypto";
import { defaultFinanceHeadline, defaultSpecials, type Special, type SpecialImage } from "../../../app/lib/specials.js";
import { defaultPhotos, type Photo } from "../../../app/lib/photo-catalog.js";
import { PhotoError, readPhotos, storeUploadedPhoto, type PhotoStore } from "./photos.js";

function rememberImage(current: SpecialImage, history: SpecialImage[]) {
  return [current, ...history].filter((item, index, items) => items.findIndex((other) => other.image === item.image && other.alt === item.alt) === index).slice(0, 10);
}

function effectiveImage(image: string, alt: string, photos: Photo[]): SpecialImage {
  const photo = photos.find((item) => item.originalSrc === image);
  const original = defaultPhotos.find((item) => item.id === photo?.id);
  const overridden = photo && (photo.src !== image || photo.alt !== original?.alt);
  return { image: photo?.src || image, alt: overridden ? photo.alt : alt };
}

export async function readSpecials(store: PhotoStore) {
  const entry = await store.getWithMetadata("specials.json", { type: "json" });
  const saved: Special[] = entry?.data?.specials || [];
  const photos = (await readPhotos(store)).photos;
  const specials = [...defaultSpecials.map((deal) => saved.find((item) => item.id === deal.id) || deal), ...saved.filter((item) => !defaultSpecials.some((deal) => deal.id === item.id))].map((deal) => {
    const original = defaultSpecials.find((item) => item.id === deal.id);
    const originalImage = original ? effectiveImage(original.image, original.alt, photos) : undefined;
    // Older replacements did not record history; retain their known original.
    const fallback = originalImage && deal.image !== originalImage.image ? [originalImage] : [];
    return { ...deal, imageHistory: deal.imageHistory || fallback };
  });
  return {
    specials,
    financeHeadline: typeof entry?.data?.financeHeadline === "string" ? entry.data.financeHeadline : defaultFinanceHeadline,
    revision: entry?.etag || "",
  };
}

export async function mutateSpecials(store: PhotoStore, body: Record<string, unknown>) {
  const current = await readSpecials(store);
  if (typeof body.revision !== "string" || body.revision !== current.revision) throw new PhotoError(409, "Specials changed in another session. Refresh and try again.");
  const specials = current.specials.map((deal) => ({ ...deal }));
  let financeHeadline = current.financeHeadline;
  let deal = specials.find((item) => item.id === body.id);
  if (body.id && !deal) throw new PhotoError(404, "Special not found");
  if (body.action === "save-labels") {
    if (typeof body.financeHeadline !== "string" || body.financeHeadline.length > 240) throw new PhotoError(400, "Enter a financing headline up to 240 characters, or leave it blank to hide it.");
    financeHeadline = body.financeHeadline.trim();
  } else if (body.action === "save") {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.length > 100) throw new PhotoError(400, "Enter a special name (up to 100 characters).");
    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price <= 0 || body.price > 99999) throw new PhotoError(400, "Enter a sale price greater than zero.");
    if (body.before !== null && (typeof body.before !== "number" || !Number.isFinite(body.before) || body.before < body.price || body.before > 99999)) throw new PhotoError(400, "The original price must be at least the sale price, or leave it blank.");
    if (typeof body.minimumSqFt !== "number" || !Number.isInteger(body.minimumSqFt) || body.minimumSqFt < 0 || body.minimumSqFt > 100000) throw new PhotoError(400, "Enter a whole-number minimum square footage (zero means no minimum).");
    if (typeof body.alt !== "string" || !body.alt.trim() || body.alt.length > 240) throw new PhotoError(400, "Add a photo description (up to 240 characters).");
    if (!deal && !body.image) throw new PhotoError(400, "Choose an image for the new special.");
    if (!deal && specials.length >= 100) throw new PhotoError(400, "Up to 100 specials are supported. Replace an existing offer instead.");
    const image = body.image ? await storeUploadedPhoto(store, body.image) : deal!.image;
    if (body.image && deal) {
      const photos = (await readPhotos(store)).photos;
      deal.imageHistory = rememberImage(effectiveImage(deal.image, deal.alt, photos), deal.imageHistory || []);
    }
    if (!deal) {
      deal = { id: `special-${randomUUID()}`, name: "", before: null, price: 0, minimumSqFt: 0, image: "", alt: "", hidden: false, order: Math.max(0, ...specials.map((item) => item.order)) + 1, imageHistory: [] };
      specials.push(deal);
    }
    Object.assign(deal, { name: body.name.trim(), price: Math.round(body.price * 100) / 100, before: body.before === null ? null : Math.round((body.before as number) * 100) / 100, minimumSqFt: body.minimumSqFt, alt: body.alt.trim(), image });
  } else if (deal && body.action === "restore-image") {
    const history = deal.imageHistory || [];
    if (typeof body.historyIndex !== "number" || !Number.isInteger(body.historyIndex) || body.historyIndex < 0 || body.historyIndex >= history.length) throw new PhotoError(400, "Choose an available previous image.");
    const previous = history[body.historyIndex];
    deal.imageHistory = rememberImage({ image: deal.image, alt: deal.alt }, history.filter((_, index) => index !== body.historyIndex));
    deal.image = previous.image;
    deal.alt = previous.alt;
  } else if (deal && body.action === "visibility" && typeof body.hidden === "boolean") {
    deal.hidden = body.hidden;
  } else if (deal && body.action === "move" && (body.direction === "up" || body.direction === "down")) {
    const ordered = specials.filter((item) => !item.hidden).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
    const index = ordered.findIndex((item) => item.id === deal!.id);
    const target = index + (body.direction === "up" ? -1 : 1);
    if (index < 0 || target < 0 || target >= ordered.length) throw new PhotoError(400, "Special is already at the edge of the list.");
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    ordered.forEach((item, order) => { item.order = order; });
  } else throw new PhotoError(400, "Invalid special action");
  const result = await store.setJSON("specials.json", { specials, financeHeadline }, current.revision ? { onlyIfMatch: current.revision } : { onlyIfNew: true });
  if (!result.modified) throw new PhotoError(409, "Specials changed in another session. Refresh and try again.");
  return { specials, financeHeadline, revision: result.etag || "" };
}
