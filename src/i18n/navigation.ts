import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Wrappers de `next/link` y `next/navigation` que conocen el idioma activo.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
