import type { Handler } from "@netlify/functions";
import { dataStore, initBlobs, json, requireSession, type User } from "./_lib/admin.js";
import { mutatePhotos, PhotoError, photoStore, readPhotos } from "./_lib/photos.js";

export const handler: Handler = async (event) => {
  try {
    initBlobs(event);
    if (event.httpMethod === "GET") {
      const current = await readPhotos(photoStore());
      if (event.queryStringParameters?.admin === "1") {
        const session = requireSession(event.headers);
        if (!session) return json(401, { error: "Sign in to manage photos." });
        const user = await dataStore().get(`users/${session.sub}.json`, { type: "json", consistency: "strong" }) as User | null;
        if (!user?.active) return json(403, { error: "This account cannot manage photos." });
        return json(200, current);
      }
      return json(200, { photos: current.photos.filter((photo) => !photo.hidden) });
    }
    if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" }, { Allow: "GET, POST" });
    const session = requireSession(event.headers);
    if (!session) return json(401, { error: "Sign in to manage photos." });
    const user = await dataStore().get(`users/${session.sub}.json`, { type: "json", consistency: "strong" }) as User | null;
    if (!user?.active || !["admin", "staff"].includes(user.role)) return json(403, { error: "This account cannot manage photos." });
    const origin = event.headers.origin || event.headers.Origin;
    const host = event.headers.host || event.headers.Host;
    if (!origin || new URL(origin).host !== host) return json(403, { error: "Please upload from this website's admin page." });
    if (!event.headers["content-type"]?.startsWith("application/json")) return json(415, { error: "Expected a photo upload." });
    if (!event.body || event.body.length > 4.3 * 1024 * 1024) return json(413, { error: "Photo is too large. Choose an image smaller than 3 MB." });
    let body;
    try { body = JSON.parse(event.body); } catch { return json(400, { error: "Invalid photo request." }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, { error: "Invalid photo request." });
    return json(200, await mutatePhotos(photoStore(), body));
  } catch (error) {
    if (error instanceof PhotoError) return json(error.status, { error: error.message });
    console.error("Photo request failed", error);
    return json(500, { error: "Unable to save photos. Please try again." });
  }
};
