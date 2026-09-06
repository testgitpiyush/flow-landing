import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://flow-landing.com";
  const pages = [
    "",
    "/features",
    "/pricing",
    "/workflow",
    "/changelog",
    "/integrations",
    "/about",
    "/blog",
    "/careers",
    "/contact",
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "weekly" : "monthly",
    priority: page === "" ? 1 : 0.8,
  }));
}
