import type { Handler } from "@netlify/functions";
import { dataStore, initBlobs, json } from "./_lib/admin.js";
import { photoStore, readPhotos } from "./_lib/photos.js";

export const handler: Handler = async (event) => {
  initBlobs(event);
  let blobs = false;
  let blobError = "";
  let photoStorage = false;
  let photoStorageError = "";
  try {
    await dataStore().list({ prefix: "health/" });
    blobs = true;
  } catch (error) {
    blobError = error instanceof Error ? error.message : "Unknown Blob storage error";
  }
  try { await readPhotos(photoStore()); photoStorage = true; }
  catch (error) { photoStorageError = error instanceof Error ? `${error.name}: ${error.message}` : "Unknown photo storage error"; }
  return json(200, {
    adminEmail: Boolean(process.env.ADMIN_EMAIL),
    adminPassword: Boolean(process.env.ADMIN_PASSWORD),
    sessionSecret: Boolean(process.env.SESSION_SECRET),
    sessionSecretLength: process.env.SESSION_SECRET?.length || 0,
    blobs,
    blobError,
    photoStorage,
    photoStorageError,
  });
};
