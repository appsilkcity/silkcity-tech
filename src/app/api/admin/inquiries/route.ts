import { createCollectionRoute } from "@/lib/admin-collections";

const handlers = createCollectionRoute("inquiries");

export const GET = handlers.GET;
export const POST = handlers.POST;
export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
