import type { Handler } from "@netlify/functions";
import { connectLambda } from "@netlify/blobs";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { cleanText, dataStore, json, listUsers, requireSession, saveUser, type Role, type User } from "./_lib/admin.js";

const publicUser = (user: User) => ({ id: user.id, email: user.email, role: user.role, active: user.active, createdAt: user.createdAt });

export const handler: Handler = async (event) => {
  try {
    connectLambda(event as never);
    const session = requireSession(event.headers);
    if (!session || session.role !== "admin") return json(403, { error: "Administrator access required" });
    if (event.httpMethod === "GET") return json(200, { users: (await listUsers()).map(publicUser) });
    const body = JSON.parse(event.body || "{}");
    if (event.httpMethod === "POST") {
      const email = cleanText(body.email, 160).toLowerCase();
      const password = String(body.password || "");
      const role: Role = body.role === "admin" ? "admin" : "staff";
      if (!email.includes("@") || password.length < 8) return json(400, { error: "Valid email and an 8-character password are required" });
      if ((await listUsers()).some((user) => user.email === email)) return json(409, { error: "A user with that email already exists" });
      const user: User = { id: randomUUID(), email, passwordHash: await bcrypt.hash(password, 12), role, active: true, createdAt: new Date().toISOString() };
      await saveUser(user);
      return json(201, { user: publicUser(user) });
    }
    if (event.httpMethod === "PATCH") {
      const id = cleanText(body.id, 80);
      const store = dataStore();
      const user = await store.get(`users/${id}.json`, { type: "json" }) as User | null;
      if (!user) return json(404, { error: "User not found" });
      if (typeof body.active === "boolean") user.active = body.active;
      if (body.password) {
        if (String(body.password).length < 8) return json(400, { error: "Password must be at least 8 characters" });
        user.passwordHash = await bcrypt.hash(String(body.password), 12);
      }
      if (body.role === "admin" || body.role === "staff") user.role = body.role;
      await saveUser(user);
      return json(200, { user: publicUser(user) });
    }
    return json(405, { error: "Method not allowed" });
  } catch (error) { console.error(error); return json(500, { error: "Unable to manage users" }); }
};
