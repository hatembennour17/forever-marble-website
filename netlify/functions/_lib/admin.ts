import { connectLambda, getStore } from "@netlify/blobs";
import bcrypt from "bcryptjs";
import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export type Role = "admin" | "staff";
export type User = { id: string; email: string; passwordHash: string; role: Role; active: boolean; createdAt: string };
export type Session = { sub: string; email: string; role: Role; exp: number };
export const dataStore = () => getStore("forever-marble-admin");
export const initBlobs = (event: unknown) => connectLambda(event as never);
export const json = (statusCode: number, body: unknown, headers: Record<string, string> = {}) => ({ statusCode, headers: { "content-type": "application/json", "cache-control": "no-store", ...headers }, body: JSON.stringify(body) });

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters.");
  return value;
}

function b64(value: string) { return Buffer.from(value).toString("base64url"); }
function sign(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }

export function createSession(user: Pick<User, "id" | "email" | "role">) {
  const payload: Session = { sub: user.id, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 };
  const encoded = b64(JSON.stringify(payload));
  return `${encoded}.${sign(encoded)}`;
}

export function readSession(cookieHeader = ""): Session | null {
  const token = cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith("fm_admin="))?.slice(9);
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString()) as Session;
    return session.exp > Math.floor(Date.now() / 1000) ? session : null;
  } catch { return null; }
}

export const sessionCookie = (token: string) => `fm_admin=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`;
export const clearSessionCookie = () => "fm_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0";

export async function listUsers(): Promise<User[]> {
  const store = dataStore();
  const result = await store.list({ prefix: "users/" });
  const users = await Promise.all(result.blobs.map((blob) => store.get(blob.key, { type: "json" }) as Promise<User>));
  return users.filter(Boolean).sort((a, b) => a.email.localeCompare(b.email));
}

export async function findUserByEmail(email: string) {
  return (await listUsers()).find((user) => user.email === email.toLowerCase());
}

export async function saveUser(user: User) { await dataStore().setJSON(`users/${user.id}.json`, user); }

export async function authenticate(email: string, password: string): Promise<User | null> {
  const normalized = email.trim().toLowerCase();
  let user = await findUserByEmail(normalized);
  if (!user && normalized === process.env.ADMIN_EMAIL?.trim().toLowerCase() && password === process.env.ADMIN_PASSWORD) {
    user = { id: randomUUID(), email: normalized, passwordHash: await bcrypt.hash(password, 12), role: "admin", active: true, createdAt: new Date().toISOString() };
    await saveUser(user);
  }
  if (!user?.active || !(await bcrypt.compare(password, user.passwordHash))) return null;
  return user;
}

export function requireSession(headers: Record<string, string | undefined>) { return readSession(headers.cookie || headers.Cookie || ""); }
export function cleanText(value: unknown, max = 1000) { return String(value ?? "").trim().slice(0, max); }
