import { loadPlans } from "@/lib/plans";
import { jsonLdScript, landingJsonLd } from "@/lib/site";

/**
 * The landing page's structured data. An async component of its own, inside a Suspense
 * boundary, because the offers come from the same cached read of GET /plans the plans
 * list uses: the price Google reads is the price the page shows, and an unreachable API
 * degrades to the free offer rather than failing the page.
 */
export async function LandingJsonLd() {
  const plans = await loadPlans();
  const offers = plans?.map((p) => ({ name: p.name, amount: p.amount, currency: p.currency })) ?? null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(landingJsonLd(offers)) }}
    />
  );
}
