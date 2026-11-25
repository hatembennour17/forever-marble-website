import { randomUUID } from "node:crypto";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";
import { getStore } from "@netlify/blobs";
import { defaultPhotos, type Photo } from "../../../app/lib/photo-catalog.js";

export const photoStore = () => getStore({ name: "forever-marble-photos", consistency: "strong" });
export type PhotoStore = Pick<ReturnType<typeof photoStore>, "getWithMetadata" | "setJSON" | "set" | "get">;
export class PhotoError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function readPhotos(store: PhotoStore) {
  const entry = await store.getWithMetadata("manifest.json", { type: "json" });
  const saved: Photo[] = entry?.data?.photos || [];
  const defaults = defaultPhotos.map((photo) => saved.find((item) => item.id === photo.id) || photo);
  const custom = saved.filter((item) => item.section === "gallery" && !defaultPhotos.some((photo) => photo.id === item.id));
  return { photos: [...defaults, ...custom], revision: entry?.etag || "" };
}

export async function mutatePhotos(store: PhotoStore, body: Record<string, unknown>) {
  const current = await readPhotos(store);
  if (typeof body.revision !== "string" || body.revision !== current.revision)
    throw new PhotoError(409, "Photos changed in another session. Refresh and try again.");
  const photos = current.photos.map((photo) => ({ ...photo }));
  let photo = photos.find((item) => item.id === body.id);
  if (body.action === "upload") {
    if (body.id && !photo) throw new PhotoError(404, "Photo not found");
    if (!photo && photos.filter((item) => item.section === "gallery").length >= 200)
      throw new PhotoError(400, "The gallery supports up to 200 photos. Replace an existing photo instead.");
    if (typeof body.alt !== "string" || !body.alt.trim() || body.alt.length > 240)
      throw new PhotoError(400, "Add a description of the photo (up to 240 characters).");
    const uploadedSrc = await storeUploadedPhoto(store, body.image);
    if (!photo) {
      photo = { id: `gallery-${randomUUID()}`, src: "", alt: "", label: "Gallery photo", section: "gallery", order: Math.max(0, ...photos.filter((item) => item.section === "gallery").map((item) => item.order)) + 1, hidden: false, pages: ["gallery"] };
      photos.push(photo);
    }
    photo.src = uploadedSrc;
    photo.alt = body.alt.trim();
    photo.hidden = false;
  } else {
    if (!photo) throw new PhotoError(404, "Photo not found");
    if (body.action === "describe") {
      if (typeof body.alt !== "string" || !body.alt.trim() || body.alt.length > 240) throw new PhotoError(400, "Add a description (up to 240 characters).");
      photo.alt = body.alt.trim();
    } else if (body.action === "visibility" && photo.section === "gallery" && typeof body.hidden === "boolean") {
      photo.hidden = body.hidden;
    } else if (body.action === "move" && photo.section === "gallery" && (body.direction === "up" || body.direction === "down")) {
      const gallery = photos.filter((item) => item.section === "gallery" && !item.hidden).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
      const index = gallery.findIndex((item) => item.id === photo!.id);
      const target = index + (body.direction === "up" ? -1 : 1);
      if (index < 0 || target < 0 || target >= gallery.length) throw new PhotoError(400, "Photo is already at the edge of the gallery.");
      [gallery[index], gallery[target]] = [gallery[target], gallery[index]];
      gallery.forEach((item, order) => { item.order = order; });
    } else if (body.action === "restore" && photo.originalSrc) {
      const original = defaultPhotos.find((item) => item.id === photo!.id)!;
      photo.src = original.src; photo.alt = original.alt; photo.hidden = false;
    } else throw new PhotoError(400, "Invalid photo action");
  }
  const result = await store.setJSON("manifest.json", { photos }, current.revision ? { onlyIfMatch: current.revision } : { onlyIfNew: true });
  if (!result.modified) throw new PhotoError(409, "Photos changed in another session. Refresh and try again.");
  return { photos, revision: result.etag || "" };
}

export async function storeUploadedPhoto(store: PhotoStore, image: unknown) {
  if (typeof image !== "string" || image.length > 4 * 1024 * 1024 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image))
    throw new PhotoError(400, "Choose a JPG, PNG or WebP image smaller than 3 MB.");
  const bytes = Buffer.from(image, "base64");
  if (bytes.length > 3 * 1024 * 1024) throw new PhotoError(400, "Image must be smaller than 3 MB.");
  let output: Buffer;
  let contentType: string;
  try {
    if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
      const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
      if (!width || !height || width > 2400 || height > 2400) throw new Error("Image too large");
      const decoded = PNG.sync.read(bytes, { checkCRC: true });
      output = PNG.sync.write({ width: decoded.width, height: decoded.height, data: decoded.data } as PNG);
      contentType = "image/png";
    } else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
      const decoded = jpeg.decode(bytes, { maxResolutionInMP: 6, maxMemoryUsageInMB: 128, tolerantDecoding: false });
      if (!decoded.width || !decoded.height || decoded.width > 2400 || decoded.height > 2400) throw new Error("Image too large");
      output = Buffer.from(jpeg.encode({ width: decoded.width, height: decoded.height, data: decoded.data }, 88).data);
      contentType = "image/jpeg";
    } else throw new Error("Unsupported image");
    if (output.length > 3 * 1024 * 1024) throw new Error("Image too large");
  } catch { throw new PhotoError(400, "Unable to prepare this image. Try a smaller JPG, PNG or WebP photo using the upload control."); }
  const fileId = randomUUID();
  // Re-encoding strips embedded metadata and produces a safe, immutable raster image.
  await store.set(`files/${fileId}`, new Blob([new Uint8Array(output)]), { metadata: { contentType } });
    return `/.netlify/functions/photo-file?id=${fileId}`;
}
