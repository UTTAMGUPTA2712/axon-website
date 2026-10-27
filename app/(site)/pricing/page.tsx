import Link from "next/link";
import { Suspense } from "react";
import { Colophon } from "@/components/site/colophon";
import { Masthead } from "@/components/site/masthead";
import { SITE_NAV } from "@/components/site/nav";
import { Plans, PlansFallback } from "@/components/site/plans";
import { STORE_URL, jsonLd, jsonLdScript, metadataFor } from "@/lib/site";

export const metadata = metadataFor("/pricing");

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd("/pricing")) }}
      />
      <Masthead items={SITE_NAV} />
      <main className="spread spread-single">
        <article className="document">
          <section className="chapter" style={{ paddingTop: "clamp(44px,7vw,86px)" }}>
            <h1 className="lede-title">Pricing</h1>
            <p className="lede">
              Axon is free with an API key of your own. An account is the alternative for
              when you would rather not hold one.
            </p>
          </section>

          <section className="chapter">
            <h2>The plans</h2>
            <Suspense fallback={<PlansFallback />}>
              <Plans />
            </Suspense>
          </section>

          <section className="chapter">
            <h2>Which one is for you</h2>
            <p>
              <b>Your own key</b> costs Axon nothing and keeps everything in your browser:
              the page text goes from your browser to the provider you chose, billed by
              that provider (Gemini has a free tier, and a local model costs nothing).
            </p>
            <p>
              <b>An account</b> runs prompts on Axon&apos;s server instead, against a daily
              allowance. That means your question and the page text you send pass through
              and are stored by Axon; the{" "}
              <Link href="/privacy">privacy policy</Link> says exactly what.
            </p>
            <div className="actions" style={{ marginTop: 28 }}>
              <a className="btn-install" href={STORE_URL} target="_blank" rel="noopener">
                Add to Chrome
              </a>
              <Link className="btn-plain" href="/register">
                Create an account
              </Link>
            </div>
          </section>
        </article>
      </main>
      <Colophon />
    </>
  );
}
