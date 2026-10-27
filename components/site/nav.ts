import { PAGES } from "@/lib/site";

/** Masthead links for every page but the landing page, which has section anchors instead. */
export const SITE_NAV = [
  ...PAGES.filter((p) => !["/", "/privacy"].includes(p.path)).map((p) => ({
    href: p.path,
    label: p.label,
    section: true,
  })),
  { href: "/privacy", label: "Privacy" },
];
