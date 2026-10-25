import { cacheLife } from "next/cache";
import { API_URL } from "@/lib/config";

interface PlanRow {
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
async function loadPlans(): Promise<PlanRow[] | null> {
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

function money(plan: PlanRow): string {
  if (!plan.amount) return "Free";
  // The API stores minor units, the way payment processors do.
  const major = plan.amount / 100;
  const shown = major % 1 === 0 ? String(major) : major.toFixed(2);
  return `${plan.currency} ${shown} a ${plan.interval}`;
}

function allowance(plan: PlanRow): string {
  if (plan.limit === null) return "No daily limit";
  if (plan.limit === 1) return "1 prompt a day";
  return `${plan.limit} prompts a day`;
}

/** The row that is not a plan, and the one this page recommends. */
function OwnKey() {
  return (
    <div>
      <b>Your own key</b>
      <span>
        Free, unlimited, and nothing you look at reaches us — the default, and what the
        rest of this page describes
      </span>
    </div>
  );
}

/** Written out in full, because the page has to say what the plans are whether or not the API answers. */
export function PlansFallback() {
  return (
    <div className="ledger">
      <div>
        <b>Free</b>
        <span>A daily allowance of prompts, enough to decide whether Axon is for you</span>
      </div>
      <div>
        <b>Paid</b>
        <span>No daily limit. Current pricing is on the account page</span>
      </div>
      <OwnKey />
    </div>
  );
}

export async function Plans() {
  const plans = await loadPlans();
  if (!plans?.length) return <PlansFallback />;

  return (
    <div className="ledger">
      {plans.map((plan) => (
        <div key={plan.name}>
          <b>{plan.name}</b>
          <span>
            {allowance(plan)} · {money(plan)}
          </span>
        </div>
      ))}
      <OwnKey />
    </div>
  );
}
