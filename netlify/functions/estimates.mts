import type { Handler } from "@netlify/functions";
import { randomUUID } from "node:crypto";
import { cleanText, dataStore, initBlobs, json, requireSession } from "./_lib/admin.js";

type EstimateStatus = "New" | "Contacted" | "Scheduled" | "Won" | "Archived";
const allowedStatuses = new Set<EstimateStatus>(["New", "Contacted", "Scheduled", "Won", "Archived"]);

export const handler: Handler = async (event) => {
  try {
    initBlobs(event);
    const store = dataStore();
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body || "{}");
      if (body.website) return json(200, { ok: true });
      const estimate = { id: randomUUID(), createdAt: new Date().toISOString(), name: cleanText(body.name, 120), phone: cleanText(body.phone, 40), email: cleanText(body.email, 160).toLowerCase(), project: cleanText(body.project, 80), material: cleanText(body.material, 80), message: cleanText(body.message, 2000), status: "New" as EstimateStatus };
      if (!estimate.name || !estimate.phone || !estimate.email.includes("@")) return json(400, { error: "Name, phone and a valid email are required" });
      await store.setJSON(`estimates/${estimate.id}.json`, estimate);
      return json(201, { ok: true, id: estimate.id });
    }
    const session = requireSession(event.headers);
    if (!session) return json(401, { error: "Not signed in" });
    if (event.httpMethod === "GET") {
      const result = await store.list({ prefix: "estimates/" });
      const estimates = await Promise.all(result.blobs.map((blob) => store.get(blob.key, { type: "json" })));
      return json(200, { estimates: estimates.filter(Boolean).sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt)) });
    }
    const body = JSON.parse(event.body || "{}");
    const id = cleanText(body.id, 80);
    if (!id) return json(400, { error: "Estimate ID is required" });
    if (event.httpMethod === "DELETE") { await store.delete(`estimates/${id}.json`); return json(200, { ok: true }); }
    if (event.httpMethod === "PATCH") {
      const estimate = await store.get(`estimates/${id}.json`, { type: "json" });
      if (!estimate) return json(404, { error: "Estimate not found" });
      const status = cleanText(body.status, 30) as EstimateStatus;
      if (!allowedStatuses.has(status)) return json(400, { error: "Invalid status" });
      await store.setJSON(`estimates/${id}.json`, { ...estimate, status });
      return json(200, { ok: true });
    }
    return json(405, { error: "Method not allowed" });
  } catch (error) { console.error(error); return json(500, { error: "Unable to process estimates" }); }
};
