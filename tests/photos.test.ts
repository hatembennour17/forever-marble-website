import assert from "node:assert/strict";
import { test } from "node:test";
import sharp from "sharp";
import { defaultPhotos } from "../app/lib/photo-catalog";
import { mutatePhotos, readPhotos, type PhotoStore } from "../netlify/functions/_lib/photos";

export function memoryStore() {
  const files = new Map<string, unknown>(); let version = 0;
  const store = {
    async getWithMetadata(key: string) { return files.has(key) ? { data: structuredClone(files.get(key)), etag: String(version), metadata: {} } : null; },
    async setJSON(key: string, value: unknown, options: { onlyIfNew?: boolean; onlyIfMatch?: string } = {}) {
      if ((options.onlyIfNew && files.has(key)) || (options.onlyIfMatch && options.onlyIfMatch !== String(version))) return { modified: false };
      files.set(key, structuredClone(value)); return { modified: true, etag: String(++version) };
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
  const input = await sharp({ create: { width: 80, height: 60, channels: 3, background: "red" } }).jpeg().toBuffer();
  const photo = defaultPhotos.find((photo) => photo.originalSrc === "/images/hero-kitchen.png")!;
  const result = await mutatePhotos(store, { action: "upload", id: photo.id, image: input.toString("base64"), alt: "New kitchen", revision: "" });
  const replacement = result.photos.find((item) => item.id === photo.id)!;
  assert.match(replacement.src, /^\/\.netlify\/functions\/photo-file\?id=/);
  const file = [...files.entries()].find(([key]) => key.startsWith("files/"))![1] as Blob;
  assert.equal((await sharp(Buffer.from(await file.arrayBuffer())).metadata()).format, "webp");
  assert.equal(result.photos.find((item) => item.id !== photo.id)?.src, defaultPhotos.find((item) => item.id !== photo.id)?.src);
  assert.equal((await readPhotos(store)).photos.find((item) => item.id === photo.id)?.alt, "New kitchen");
  const restored = await mutatePhotos(store, { action: "restore", id: photo.id, revision: result.revision });
  assert.equal(restored.photos.find((item) => item.id === photo.id)?.src, photo.originalSrc);
});

test("gallery additions, movement, hiding and re-showing persist", async () => {
  const { store } = memoryStore();
  const image = (await sharp({ create: { width: 8, height: 8, channels: 3, background: "blue" } }).png().toBuffer()).toString("base64");
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
