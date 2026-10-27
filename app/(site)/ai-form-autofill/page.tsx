import { IntentPage } from "@/components/site/intent-page";
import { INTENTS } from "@/lib/intents";
import { metadataFor } from "@/lib/site";

export const metadata = metadataFor(INTENTS["autofill"].path);

export default function Page() {
  return <IntentPage intent={INTENTS["autofill"]} />;
}
