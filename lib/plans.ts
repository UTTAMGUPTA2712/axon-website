import { cacheLife } from "next/cache";
import { API_URL } from "@/lib/config";

export interface PlanRow {
  name: string;
  limit: number | null;
  amount: number;
  currency: string;
  interval: string;
}

/**
 * The one thing on the landing page that is not already in the document: what the
 * service currently charges, read from the public GET /plans.
 *
 * Ten minutes is long enough that a reader moving around costs one request and short
 * enough that a price change is live the same morning. A failure is caught here, not
 * by the caller: an error thrown out of a cache scope fails the build when the API is
 * down at prerender time. It is cached for thirty seconds only, so the fallback rows
 * never outlive the outage by long.
 */
export async function loadPlans(): Promise<PlanRow[] | null> {
  "use cache";

  try {
    const response = await fetch(`${API_URL}/plans`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) throw new Error(`plans: HTTP ${response.status}`);
    const plans: unknown = await response.json();
    if (!Array.isArray(plans)) throw new Error("plans: not a list");

    cacheLife({ stale: 600, revalidate: 600, expire: 86_400 });
    // Only what the section renders is kept.
    return plans.map((plan) => ({
      name: String(plan.name || plan.key || "Plan"),
      limit: plan.dailyPromptLimit === null ? null : Number(plan.dailyPromptLimit),
      amount: Number(plan.priceAmount || 0),
      currency: String(plan.currency || "usd").toUpperCase(),
      interval: String(plan.interval || "month"),
    }));
  } catch {
    cacheLife({ stale: 30, revalidate: 30, expire: 60 });
    return null;
  }
}

