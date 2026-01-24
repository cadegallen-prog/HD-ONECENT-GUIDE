import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
        disallow: [],
      },
    ],
    sitemap: "https://www.pennycentral.com/sitemap.xml",
  }
}
