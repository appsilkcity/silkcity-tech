import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "silkcity_admin";
const SESSION_SECONDS = 60 * 60 * 8;

export function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password || password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be set to at least 8 characters.");
  }
  return password;
}

function sign(payload: string, password: string) {
  return createHmac("sha256", `silkcity-admin-session:${password}`).update(payload).digest("base64url");
}

export function createSessionToken(password: string) {
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS, v: 1 })).toString("base64url");
  return `${payload}.${sign(payload, password)}`;
}

export function verifySessionToken(token: string | undefined, password: string) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = sign(payload, password);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { exp?: number };
    return typeof parsed.exp === "number" && parsed.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function isAdmin() {
  try {
    const store = await cookies();
    return verifySessionToken(store.get(ADMIN_COOKIE)?.value, getAdminPassword());
  } catch {
    return false;
  }
}

export async function requireAdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function assertAdminApi() {
  if (!(await isAdmin())) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });
  }
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}
