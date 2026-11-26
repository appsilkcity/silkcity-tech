import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof Response) return error;
  if (error instanceof ZodError) {
    return NextResponse.json({ error: "Validation failed", issues: error.flatten() }, { status: 422 });
  }
  console.error(error);
  const message = error instanceof Error ? error.message : "Unexpected server error";
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Response(JSON.stringify({ error: "Invalid JSON body" }), { status: 400, headers: { "content-type": "application/json" } });
  }
}

export function assertTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return;
  const host = request.headers.get("host");
  try {
    if (host && new URL(origin).host !== host) {
      throw new Response(JSON.stringify({ error: "Cross-origin request rejected" }), { status: 403, headers: { "content-type": "application/json" } });
    }
  } catch (error) {
    if (error instanceof Response) throw error;
    throw new Response(JSON.stringify({ error: "Invalid origin" }), { status: 403, headers: { "content-type": "application/json" } });
  }
}
