import { photoStore } from "./_lib/photos.js";

const json = (status: number, error: string) => Response.json({ error }, { status, headers: { "cache-control": "no-store" } });
export default async (request: Request) => {
  if (request.method !== "GET") return json(405, "Method not allowed");
  const id = new URL(request.url).searchParams.get("id") || "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id)) return json(404, "Photo not found");
  try {
    const file = await photoStore().getWithMetadata(`files/${id}`, { type: "arrayBuffer" });
    if (!file) return json(404, "Photo not found");
    const contentType = file.metadata.contentType;
    if (contentType !== "image/jpeg" && contentType !== "image/png") return json(404, "Photo not found");
    return new Response(file.data, { headers: { "content-type": contentType, "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
  } catch { return json(500, "Unable to load photo"); }
};
