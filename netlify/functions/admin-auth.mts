import type { Handler } from "@netlify/functions";
import { connectLambda } from "@netlify/blobs";
import { authenticate, clearSessionCookie, createSession, json, requireSession, sessionCookie } from "./_lib/admin.js";

export const handler: Handler = async (event) => {
  try {
    connectLambda(event as never);
    if (event.httpMethod === "GET") {
      const session = requireSession(event.headers);
      return session ? json(200, { user: session }) : json(401, { error: "Not signed in" });
    }
    if (event.httpMethod === "DELETE") return json(200, { ok: true }, { "set-cookie": clearSessionCookie() });
    if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
    const body = JSON.parse(event.body || "{}");
    const user = await authenticate(String(body.email || ""), String(body.password || ""));
    if (!user) return json(401, { error: "Invalid email or password" });
    return json(200, { user: { id: user.id, email: user.email, role: user.role } }, { "set-cookie": sessionCookie(createSession(user)) });
  } catch (error) { console.error(error); return json(500, { error: "Authentication is not configured yet" }); }
};
