import "@/app/(site)/site.css";
import { Masthead } from "./masthead";
import { SITE_NAV } from "./nav";

/**
 * The public masthead, for the pages outside the (site) group. Signing in and the
 * account page used to open on a different bar (or none), so the navigation changed
 * under the reader the moment they clicked "Account". This is the same component with
 * the same links; the .site wrapper only carries the tokens and fonts it needs.
 */
export function AccountBar() {
  return (
    <div className="site">
      <Masthead items={SITE_NAV} />
    </div>
  );
}
