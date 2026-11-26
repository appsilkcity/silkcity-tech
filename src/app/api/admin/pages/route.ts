import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { auditLogs, pages } from "@/db/schema";
import { assertAdminApi } from "@/lib/auth";
import { assertTrustedOrigin, handleApiError, ok, readJson } from "@/lib/api";
import { pageSchema } from "@/lib/validation";

export async function GET() {
  try {
    await assertAdminApi();
    return ok(await db.select().from(pages));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    await assertAdminApi();
    assertTrustedOrigin(request);
    const { slug, ...values } = pageSchema.parse(await readJson(request));
    const rows = await db.update(pages).set({ ...values, updatedAt: new Date() }).where(eq(pages.slug, slug)).returning();
    await db.insert(auditLogs).values({ action: "update", entity: "page", entityId: slug });
    revalidatePath("/", "layout");
    revalidatePath(`/${slug}`);
    return ok(rows[0]);
  } catch (error) {
    return handleApiError(error);
  }
}
