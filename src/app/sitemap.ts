import type { MetadataRoute } from "next";
import { getSuppliers } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
  { url: `${SITE_URL}/catalog`, changeFrequency: "daily", priority: 0.9 },
  { url: `${SITE_URL}/find-supplier`, changeFrequency: "monthly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let supplierRoutes: MetadataRoute.Sitemap = [];

  try {
    const { data: suppliers } = await getSuppliers({ per_page: 100 });
    supplierRoutes = suppliers.map((supplier) => ({
      url: `${SITE_URL}/supplier/${supplier.id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch {
    // Если API недоступен на билд-машине, отдаём статичные маршруты.
  }

  return [...STATIC_ROUTES, ...supplierRoutes];
}
