import { Anchor } from "lucide-react";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-white/5 px-6 py-14">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <Anchor className="h-4 w-4 text-champagne/70" strokeWidth={1.25} />
          <span className="font-serif text-sm tracking-[0.3em] text-pearl/70 uppercase">
            {site.brand}
          </span>
        </div>

        <p className="text-[0.68rem] tracking-[0.2em] text-pearl/30 uppercase">
          {t("location")}
        </p>

        <a
          href={`mailto:${site.contactEmail}`}
          className="text-[0.72rem] tracking-wide text-pearl/40 transition-colors hover:text-champagne"
        >
          {site.contactEmail}
        </a>
      </div>
    </footer>
  );
}
