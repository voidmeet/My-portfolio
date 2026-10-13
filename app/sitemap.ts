import type { MetadataRoute } from "next";
import { profile } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: profile.website, changeFrequency: "monthly", priority: 1 }];
}
