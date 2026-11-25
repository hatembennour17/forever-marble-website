import type { Handler } from "@netlify/functions";
import { initBlobs, json } from "./_lib/admin.js";
import { photoStore } from "./_lib/photos.js";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "GET") return json(405, { error: "Method not allowed" });
  const id = event.queryStringParameters?.id || "";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id)) return json(404, { error: "Photo not found" });
  try {
    initBlobs(event);
    const file = await photoStore().getWithMetadata(`files/${id}`, { type: "arrayBuffer" });
    if (!file) return json(404, { error: "Photo not found" });
    const contentType = file.metadata.contentType;
    if (contentType !== "image/jpeg" && contentType !== "image/png") return json(404, { error: "Photo not found" });
    return { statusCode: 200, headers: { "content-type": contentType, "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" }, body: Buffer.from(file.data).toString("base64"), isBase64Encoded: true };
  } catch { return json(500, { error: "Unable to load photo" }); }
};
