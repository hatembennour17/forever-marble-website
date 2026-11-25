import assert from "node:assert/strict";
import { test } from "node:test";
import jpeg from "jpeg-js";
import { PNG } from "pngjs";
import { defaultPhotos } from "../app/lib/photo-catalog";
import { mutatePhotos, readPhotos, type PhotoStore } from "../netlify/functions/_lib/photos";
import photosHandler from "../netlify/functions/photos.mjs";
import fileHandler from "../netlify/functions/photo-file.mjs";
import { mutateSpecials, readSpecials } from "../netlify/functions/_lib/specials";
import specialsHandler from "../netlify/functions/specials.mjs";
import { handler as authHandler } from "../netlify/functions/admin-auth.mjs";

test("logout clears the secure session cookie without needing blob storage", async () => {
  const result = await authHandler({ httpMethod: "DELETE", headers: {} } as never, {} as never, () => {});
  assert.ok(result);
  assert.equal(result.statusCode, 200);
  assert.match(String(result.headers?.["set-cookie"]), /fm_admin=;/);
  assert.match(String(result.headers?.["set-cookie"]), /Max-Age=0/);
  assert.match(String(result.headers?.["set-cookie"]), /HttpOnly; Secure/);
});

test("public callers cannot read the editor manifest or upload photos", async () => {
  const editor = await photosHandler(new Request("https://example.test/.netlify/functions/photos?admin=1"));
  const upload = await photosHandler(new Request("https://example.test/.netlify/functions/photos", { method: "POST", headers: { "content-type": "application/json", origin: "https://example.test" }, body: "{}" }));
  assert.equal(editor.status, 401); assert.equal(upload.status, 401);
});

test("unsupported methods and invalid file IDs are rejected before accessing storage", async () => {
  assert.equal((await photosHandler(new Request("https://example.test/.netlify/functions/photos", { method: "DELETE" }))).status, 405);
  assert.equal((await fileHandler(new Request("https://example.test/.netlify/functions/photo-file?id=../users"))).status, 404);
});

export function memoryStore() {
  const files = new Map<string, unknown>(); let version = 0;
  const versions = new Map<string, string>();
  const store = {
    async getWithMetadata(key: string) { return files.has(key) ? { data: structuredClone(files.get(key)), etag: versions.get(key), metadata: {} } : null; },
    async setJSON(key: string, value: unknown, options: { onlyIfNew?: boolean; onlyIfMatch?: string } = {}) {
      if ((options.onlyIfNew && files.has(key)) || (options.onlyIfMatch && options.onlyIfMatch !== versions.get(key))) return { modified: false };
      files.set(key, structuredClone(value)); versions.set(key, String(++version)); return { modified: true, etag: versions.get(key) };
    },
    async set(key: string, value: unknown) { files.set(key, value); return { modified: true, etag: "file" }; },
    async get(key: string) { return files.get(key) || null; },
  } as unknown as PhotoStore;
  return { store, files };
}

test("original image catalog remains available when storage has no overrides", async () => {
  const { store } = memoryStore(); const result = await readPhotos(store);
  assert.equal(result.photos.length, defaultPhotos.length); assert.equal(result.revision, "");
  assert.equal(result.photos.filter((photo) => photo.section === "gallery").length, 12);
});

test("uploads are decoded, re-encoded, persisted, replaced and restored without changing other slots", async () => {
  const { store, files } = memoryStore();
  const input = Buffer.from(jpeg.encode({ width: 80, height: 60, data: Buffer.alloc(80 * 60 * 4, 255) }, 80).data);
  const photo = defaultPhotos.find((photo) => photo.originalSrc === "/images/hero-kitchen.png")!;
  const result = await mutatePhotos(store, { action: "upload", id: photo.id, image: input.toString("base64"), alt: "New kitchen", revision: "" });
  const replacement = result.photos.find((item) => item.id === photo.id)!;
  assert.match(replacement.src, /^\/\.netlify\/functions\/photo-file\?id=/);
  const file = [...files.entries()].find(([key]) => key.startsWith("files/"))![1] as Blob;
  assert.equal(jpeg.decode(Buffer.from(await file.arrayBuffer())).width, 80);
  assert.equal(result.photos.find((item) => item.id !== photo.id)?.src, defaultPhotos.find((item) => item.id !== photo.id)?.src);
  assert.equal((await readPhotos(store)).photos.find((item) => item.id === photo.id)?.alt, "New kitchen");
  const restored = await mutatePhotos(store, { action: "restore", id: photo.id, revision: result.revision });
  assert.equal(restored.photos.find((item) => item.id === photo.id)?.src, photo.originalSrc);
});

test("gallery additions, movement, hiding and re-showing persist", async () => {
  const { store } = memoryStore();
  const image = PNG.sync.write(new PNG({ width: 8, height: 8 })).toString("base64");
  let result = await mutatePhotos(store, { action: "upload", image, alt: "New gallery photo", revision: "" });
  const added = result.photos.find((photo) => photo.alt === "New gallery photo")!;
  assert.equal(result.photos.filter((photo) => photo.section === "gallery").length, 13);
  result = await mutatePhotos(store, { action: "move", id: added.id, direction: "up", revision: result.revision });
  assert.equal(result.photos.filter((photo) => photo.section === "gallery").sort((a, b) => a.order - b.order).at(-2)?.id, added.id);
  result = await mutatePhotos(store, { action: "visibility", id: added.id, hidden: true, revision: result.revision });
  assert.equal(result.photos.find((photo) => photo.id === added.id)?.hidden, true);
  result = await mutatePhotos(store, { action: "visibility", id: added.id, hidden: false, revision: result.revision });
  assert.equal(result.photos.find((photo) => photo.id === added.id)?.hidden, false);
});

test("stale editors cannot overwrite another editor's changes", async () => {
  const { store } = memoryStore();
  await mutatePhotos(store, { action: "describe", id: defaultPhotos[0].id, alt: "First editor", revision: "" });
  await assert.rejects(mutatePhotos(store, { action: "describe", id: defaultPhotos[0].id, alt: "Second editor", revision: "" }), /another session/);
  assert.equal((await readPhotos(store)).photos[0].alt, "First editor");
});

test("invalid, SVG, oversize and nonexistent-slot uploads are rejected without saving a manifest", async () => {
  const { store, files } = memoryStore();
  for (const image of [Buffer.from("not an image").toString("base64"), Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>').toString("base64"), "A".repeat(4 * 1024 * 1024 + 4)]) {
    await assert.rejects(mutatePhotos(store, { action: "upload", image, alt: "Rejected upload", revision: "" }));
  }
  await assert.rejects(mutatePhotos(store, { action: "upload", id: "../users/admin", image: "AAAA", alt: "Bad slot", revision: "" }), /not found/);
  assert.equal(files.has("manifest.json"), false);
});

test("shared site photos cannot be hidden and descriptions are required", async () => {
  const { store } = memoryStore(); const photo = defaultPhotos.find((photo) => photo.section === "site")!;
  await assert.rejects(mutatePhotos(store, { action: "visibility", id: photo.id, hidden: true, revision: "" }), /Invalid/);
  await assert.rejects(mutatePhotos(store, { action: "describe", id: photo.id, alt: "", revision: "" }), /description/);
});

test("specials preserve all original offers and save image and price updates together", async () => {
  const { store, files } = memoryStore();
  const original = await readSpecials(store);
  assert.equal(original.specials.length, 11);
  const first = original.specials[0];
  assert.equal(first.name, "Azul Platino"); assert.equal(first.price, 34.99);
  const image = PNG.sync.write(new PNG({ width: 8, height: 8 })).toString("base64");
  const changed = await mutateSpecials(store, { action: "save", id: first.id, name: "New slab special", before: 69.99, price: 42.99, minimumSqFt: 65, alt: "Updated stone photo", image, revision: original.revision });
  const saved = changed.specials[0];
  assert.equal(saved.price, 42.99); assert.equal(saved.minimumSqFt, 65); assert.match(saved.image, /photo-file\?id=/);
  assert.deepEqual(changed.specials[1], original.specials[1]);
  assert.equal(files.has("manifest.json"), false, "special updates do not overwrite photo settings");
  assert.equal((await readSpecials(store)).specials[0].name, "New slab special");
  await assert.rejects(mutateSpecials(store, { action: "visibility", id: first.id, hidden: true, revision: "" }), /another session/);
});

test("specials can be added, reordered, hidden and shown without losing saved prices", async () => {
  const { store } = memoryStore();
  const image = PNG.sync.write(new PNG({ width: 8, height: 8 })).toString("base64");
  let result = await mutateSpecials(store, { action: "save", name: "New offer", before: null, price: 50, minimumSqFt: 0, alt: "New stone", image, revision: "" });
  assert.equal(result.specials.length, 12);
  const id = result.specials[11].id;
  result = await mutateSpecials(store, { action: "move", id, direction: "up", revision: result.revision });
  assert.equal(result.specials.filter((deal) => !deal.hidden).sort((a, b) => a.order - b.order).at(-2)?.id, id);
  result = await mutateSpecials(store, { action: "visibility", id, hidden: true, revision: result.revision });
  assert.equal(result.specials.find((deal) => deal.id === id)?.hidden, true);
  result = await mutateSpecials(store, { action: "visibility", id, hidden: false, revision: result.revision });
  assert.equal(result.specials.find((deal) => deal.id === id)?.price, 50);
});

test("invalid special prices and uploads cannot partially change an offer", async () => {
  const { store, files } = memoryStore(); const original = (await readSpecials(store)).specials[0];
  const values = { action: "save", id: original.id, name: "Update", before: 50, price: 40, minimumSqFt: 50, alt: "Stone", revision: "" };
  for (const fields of [{ price: -1 }, { price: NaN }, { before: 30 }, { minimumSqFt: 2.5 }, { image: Buffer.from("bad image").toString("base64") }]) {
    await assert.rejects(mutateSpecials(store, { ...values, ...fields }));
  }
  assert.equal(files.has("specials.json"), false);
  assert.equal((await readSpecials(store)).specials[0].price, original.price);
});

test("special editing requires authentication and rejects unsupported methods", async () => {
  assert.equal((await specialsHandler(new Request("https://example.test/.netlify/functions/specials?admin=1"))).status, 401);
  assert.equal((await specialsHandler(new Request("https://example.test/.netlify/functions/specials", { method: "POST", body: "{}" }))).status, 401);
  assert.equal((await specialsHandler(new Request("https://example.test/.netlify/functions/specials", { method: "DELETE" }))).status, 405);
});

test("replacing and restoring a special image preserves prices and supports undo", async () => {
  const { store } = memoryStore();
  const original = (await readSpecials(store)).specials[0];
  const image = PNG.sync.write(new PNG({ width: 8, height: 8 })).toString("base64");
  let result = await mutateSpecials(store, { action: "save", id: original.id, name: "Updated offer", before: 80, price: 45, minimumSqFt: 65, alt: "Replacement image", image, revision: "" });
  const replacement = result.specials[0].image;
  assert.equal(result.specials[0].imageHistory[0].image, original.image);
  result = await mutateSpecials(store, { action: "restore-image", id: original.id, historyIndex: 0, revision: result.revision });
  assert.equal(result.specials[0].image, original.image);
  assert.equal(result.specials[0].alt, original.alt);
  assert.equal(result.specials[0].name, "Updated offer");
  assert.equal(result.specials[0].price, 45); assert.equal(result.specials[0].before, 80); assert.equal(result.specials[0].minimumSqFt, 65);
  assert.equal(result.specials[0].imageHistory[0].image, replacement);
  result = await mutateSpecials(store, { action: "restore-image", id: original.id, historyIndex: 0, revision: result.revision });
  assert.equal(result.specials[0].image, replacement);
  await assert.rejects(mutateSpecials(store, { action: "restore-image", id: original.id, historyIndex: 99, revision: result.revision }), /available previous image/);
});

test("older special replacements get their original image as a restore option", async () => {
  const { store } = memoryStore(); const original = (await readSpecials(store)).specials[0];
  const { imageHistory: _history, ...legacy } = original;
  await store.setJSON("specials.json", { specials: [{ ...legacy, image: "/.netlify/functions/photo-file?id=legacy-image" }] });
  const result = await readSpecials(store);
  assert.equal(result.specials[0].imageHistory[0].image, original.image);
});

test("specials headline updates preserve offers and survive subsequent offer edits", async () => {
  const { store } = memoryStore(); const initial = await readSpecials(store);
  assert.equal(initial.financeHeadline, "0% APR $0 Down Finance for 24 Months Available!");
  const changed = await mutateSpecials(store, { action: "save-labels", financeHeadline: "New financing options available", revision: initial.revision });
  assert.equal(changed.financeHeadline, "New financing options available");
  assert.deepEqual(changed.specials, initial.specials);
  const updated = await mutateSpecials(store, { action: "visibility", id: initial.specials[0].id, hidden: true, revision: changed.revision });
  assert.equal(updated.financeHeadline, "New financing options available");
  assert.equal((await readSpecials(store)).financeHeadline, "New financing options available");
  await assert.rejects(mutateSpecials(store, { action: "save-labels", financeHeadline: "Stale edit", revision: initial.revision }), /another session/);
});

test("specials headline can be hidden and invalid labels are rejected", async () => {
  const { store } = memoryStore();
  await assert.rejects(mutateSpecials(store, { action: "save-labels", financeHeadline: "x".repeat(241), revision: "" }), /240 characters/);
  const hidden = await mutateSpecials(store, { action: "save-labels", financeHeadline: "   ", revision: "" });
  assert.equal(hidden.financeHeadline, "");
  assert.equal((await readSpecials(store)).financeHeadline, "");
});
