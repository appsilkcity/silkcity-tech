import { assertAdminApi } from "@/lib/auth";
import { handleApiError, ok } from "@/lib/api";
import { getAdminData } from "@/lib/data";

export async function GET() {
  try {
    await assertAdminApi();
    return ok(await getAdminData());
  } catch (error) {
    return handleApiError(error);
  }
}
