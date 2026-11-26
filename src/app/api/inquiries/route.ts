import { db } from "@/db";
import { inquiries } from "@/db/schema";
import { handleApiError, ok, readJson } from "@/lib/api";
import { inquirySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const values = inquirySchema.parse(await readJson(request));
    const rows = await db.insert(inquiries).values(values).returning();
    return ok({ id: rows[0].id, success: true }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
