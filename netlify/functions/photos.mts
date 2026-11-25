import { dataStore, requireSession, type User } from "./_lib/admin.js";
import { mutatePhotos, PhotoError, photoStore, readPhotos } from "./_lib/photos.js";

const json = (status: number, body: unknown, headers: Record<string, string> = {}) => Response.json(body, { status, headers: { "cache-control": "no-store", ...headers } });

// Functions v2 supplies the full Blobs environment, including strongly consistent reads.
export default async (request: Request) => {
  try {
    const headers = Object.fromEntries(request.headers.entries());
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "POST") return json(405, { error: "Method not allowed" }, { Allow: "GET, POST" });
    if (request.method === "GET" && url.searchParams.get("admin") !== "1") {
      const current = await readPhotos(photoStore());
      return json(200, { photos: current.photos.filter((photo) => !photo.hidden) });
    }
    const session = requireSession(headers);
    if (!session) return json(401, { error: "Sign in to manage photos." });
    const user = await dataStore().get(`users/${session.sub}.json`, { type: "json", consistency: "strong" }) as User | null;
    if (!user?.active || !["admin", "staff"].includes(user.role)) return json(403, { error: "This account cannot manage photos." });
    if (request.method === "GET") return json(200, await readPhotos(photoStore()));
    const origin = request.headers.get("origin");
    if (!origin || new URL(origin).host !== url.host) return json(403, { error: "Please upload from this website's admin page." });
    if (!request.headers.get("content-type")?.startsWith("application/json")) return json(415, { error: "Expected a photo upload." });
    const text = await request.text();
    if (!text || text.length > 4.3 * 1024 * 1024) return json(413, { error: "Photo is too large. Choose an image smaller than 3 MB." });
    let body;
    try { body = JSON.parse(text); } catch { return json(400, { error: "Invalid photo request." }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, { error: "Invalid photo request." });
    return json(200, await mutatePhotos(photoStore(), body));
  } catch (error) {
    if (error instanceof PhotoError) return json(error.status, { error: error.message });
    console.error("Photo request failed", error);
    return json(500, { error: "Unable to save photos. Please try again." });
  }
};
