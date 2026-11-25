// Local-only UI test harness. Never deployed as a Netlify function.
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { mutatePhotos, readPhotos, type PhotoStore } from "../netlify/functions/_lib/photos.js";
import { mutateSpecials, readSpecials } from "../netlify/functions/_lib/specials.js";
const values = new Map<string, unknown>(); let version = 0;
const users = [{ id: "local-preview", email: "preview@example.test", role: "admin", active: true, createdAt: new Date().toISOString() }];
let signedIn = true;
const store = {
  async getWithMetadata(key: string) { return values.has(key) ? { data: structuredClone(values.get(key)), etag: String(version), metadata: {} } : null; },
  async setJSON(key: string, value: unknown, options: { onlyIfNew?: boolean; onlyIfMatch?: string } = {}) {
    if ((options.onlyIfNew && values.has(key)) || (options.onlyIfMatch && options.onlyIfMatch !== String(version))) return { modified: false };
    values.set(key, structuredClone(value)); return { modified: true, etag: String(++version) };
  },
  async set(key: string, value: unknown) { values.set(key, value); return { modified: true, etag: "file" }; },
  async get(key: string) { return values.get(key) || null; },
} as unknown as PhotoStore;
const root = path.resolve("out");
const types: Record<string, string> = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url!, "http://127.0.0.1:3210");
    if (url.pathname.startsWith("/.netlify/functions/")) {
      let data: unknown = {};
      if (url.pathname.endsWith("admin-auth")) {
        if (request.method === "DELETE") { signedIn = false; data = { ok: true }; }
        else if (!signedIn) { response.writeHead(401, { "content-type": "application/json" }); response.end(JSON.stringify({ error: "Not signed in" })); return; }
        else data = { user: { sub: "local-preview", email: "preview@example.test", role: "admin" } };
      }
      else if (url.pathname.endsWith("admin-users")) {
        if (request.method === "POST") {
          let text = ""; for await (const part of request) text += part;
          const body = JSON.parse(text);
          // A delayed response reproduces the asynchronous React submit boundary.
          await new Promise((resolve) => setTimeout(resolve, 150));
          if (users.some((user) => user.email === body.email)) { response.writeHead(409, { "content-type": "application/json" }); response.end(JSON.stringify({ error: "A user with that email already exists" })); return; }
          const user = { id: `preview-${users.length}`, email: body.email, role: body.role, active: true, createdAt: new Date().toISOString() };
          users.push(user); data = { user };
        } else data = { users };
      }
      else if (url.pathname.endsWith("estimates")) data = { estimates: [] };
      else if (url.pathname.endsWith("photo-file")) {
        const blob = values.get(`files/${url.searchParams.get("id")}`) as Blob | undefined;
        if (!blob) { response.writeHead(404).end(); return; }
        response.writeHead(200, { "content-type": "image/jpeg" }); response.end(Buffer.from(await blob.arrayBuffer())); return;
      } else if (url.pathname.endsWith("specials")) {
        if (request.method === "POST") { let body = ""; for await (const part of request) body += part; data = await mutateSpecials(store, JSON.parse(body)); }
        else { const current = await readSpecials(store); data = url.searchParams.has("admin") ? current : { specials: current.specials.filter((deal) => !deal.hidden) }; }
      } else if (url.pathname.endsWith("photos")) {
        if (request.method === "POST") {
          let body = ""; for await (const part of request) body += part;
          data = await mutatePhotos(store, JSON.parse(body));
        } else { const current = await readPhotos(store); data = url.searchParams.has("admin") ? current : { photos: current.photos.filter((photo) => !photo.hidden) }; }
      } else { response.writeHead(404).end(); return; }
      response.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" }); response.end(JSON.stringify(data)); return;
    }
    let file = path.resolve(root, "." + decodeURIComponent(url.pathname));
    if (!file.startsWith(root + path.sep) && file !== root) { response.writeHead(404).end(); return; }
    if (!path.extname(file)) file = path.join(file, "index.html");
    const data = await readFile(file); response.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" }); response.end(data);
  } catch (error) { response.writeHead(400, { "content-type": "application/json" }); response.end(JSON.stringify({ error: error instanceof Error ? error.message : "Preview error" })); }
}).listen(3210, "127.0.0.1", () => console.log("Local photo preview: http://127.0.0.1:3210/admin/"));
