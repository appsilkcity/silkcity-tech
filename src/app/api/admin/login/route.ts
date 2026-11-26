import { eq } from "drizzle-orm";
import { db } from "@/db";
import { loginAttempts } from "@/db/schema";
import { createSessionToken, getAdminPassword, setAdminCookie, clientIp } from "@/lib/auth";
import { assertTrustedOrigin, fail, handleApiError, ok, readJson } from "@/lib/api";
import { adminLoginSchema } from "@/lib/validation";

const WINDOW_SECONDS = 15 * 60;
const MAX_ATTEMPTS = 8;

export async function POST(request: Request) {
  try {
    assertTrustedOrigin(request);
    const { password } = adminLoginSchema.parse(await readJson(request));
    const key = `login:${clientIp(request)}`;
    const now = Math.floor(Date.now() / 1000);
    const rows = await db.select().from(loginAttempts).where(eq(loginAttempts.key, key)).limit(1);
    const attempt = rows[0];
    if (attempt && attempt.resetAt > now && attempt.attempts >= MAX_ATTEMPTS) {
      return fail("Too many login attempts. Try again later.", 429);
    }

    let expected: string;
    try {
      expected = getAdminPassword();
    } catch {
      return fail("Admin password is not configured on the server.", 503);
    }

    if (password !== expected) {
      await db.insert(loginAttempts).values({ key, attempts: 1, resetAt: now + WINDOW_SECONDS })
        .onConflictDoUpdate({
          target: loginAttempts.key,
          set: {
            attempts: attempt && attempt.resetAt > now ? attempt.attempts + 1 : 1,
            resetAt: attempt && attempt.resetAt > now ? attempt.resetAt : now + WINDOW_SECONDS,
          },
        });
      return fail("Invalid password", 401);
    }

    await db.delete(loginAttempts).where(eq(loginAttempts.key, key));
    await setAdminCookie(createSessionToken(expected));
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
