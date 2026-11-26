import { handleSslCallback } from "@/lib/ssl-callbacks";

export async function POST(request: Request) {
  return handleSslCallback(request, "fail");
}
