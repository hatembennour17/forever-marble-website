import { dataStore, requireSession, type User } from "./_lib/admin.js";
import { PhotoError, photoStore } from "./_lib/photos.js";
import { mutateSpecials, readSpecials } from "./_lib/specials.js";

const json = (status: number, body: unknown, headers: Record<string, string> = {}) => Response.json(body, { status, headers: { "cache-control": "no-store", ...headers } });

export default async (request: Request) => {
  try {
    const url = new URL(request.url);
    if (request.method !== "GET" && request.method !== "POST") return json(405, { error: "Method not allowed" }, { Allow: "GET, POST" });
    if (request.method === "GET" && url.searchParams.get("admin") !== "1") {
      const current = await readSpecials(photoStore());
      return json(200, { specials: current.specials.filter((deal) => !deal.hidden).map(({ imageHistory: _history, ...deal }) => deal) });
    }
    const session = requireSession(Object.fromEntries(request.headers.entries()));
    if (!session) return json(401, { error: "Sign in to manage specials." });
    const user = await dataStore().get(`users/${session.sub}.json`, { type: "json", consistency: "strong" }) as User | null;
    if (!user?.active || !["admin", "staff"].includes(user.role)) return json(403, { error: "This account cannot manage specials." });
    if (request.method === "GET") return json(200, await readSpecials(photoStore()));
    const origin = request.headers.get("origin");
    if (!origin || new URL(origin).host !== url.host) return json(403, { error: "Please edit specials from this website's admin page." });
    if (!request.headers.get("content-type")?.startsWith("application/json")) return json(415, { error: "Expected a special update." });
    const text = await request.text();
    if (!text || text.length > 4.3 * 1024 * 1024) return json(413, { error: "Image is too large." });
    let body;
    try { body = JSON.parse(text); } catch { return json(400, { error: "Invalid special request." }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return json(400, { error: "Invalid special request." });
    return json(200, await mutateSpecials(photoStore(), body));
  } catch (error) {
    if (error instanceof PhotoError) return json(error.status, { error: error.message });
    console.error("Special request failed", error);
    return json(500, { error: "Unable to save specials. Please try again." });
  }
};
