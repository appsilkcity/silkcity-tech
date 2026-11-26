import { clearAdminCookie } from "@/lib/auth";
import { assertTrustedOrigin, handleApiError, ok } from "@/lib/api";

export async function POST(request: Request) {
  try {
    assertTrustedOrigin(request);
    await clearAdminCookie();
    return ok({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
