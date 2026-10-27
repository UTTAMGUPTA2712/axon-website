import { loadPlans, type PlanRow } from "@/lib/plans";

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
