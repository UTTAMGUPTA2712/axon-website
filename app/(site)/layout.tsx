import "./site.css";

/**
 * The public pages' shell. Everything in site.css is scoped under .site, so none of
 * it reaches the account pages; the masthead and colophon differ per page and are
 * rendered by the pages themselves.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <div className="site">{children}</div>;
}
