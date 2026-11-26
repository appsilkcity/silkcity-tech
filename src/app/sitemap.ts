import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const routes = ["", "/about", "/contact", "/portfolio", "/order", "/privacy-policy", "/terms"];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
