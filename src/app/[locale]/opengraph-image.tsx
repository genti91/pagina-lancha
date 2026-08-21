import { ogAlt, ogImage, contentType, size } from "@/lib/og-image";
import { routing } from "@/i18n/routing";

export { contentType, size };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return [{ id: "og", alt: await ogAlt(locale), size, contentType }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return ogImage(locale);
}
