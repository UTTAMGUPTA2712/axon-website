import Image from "next/image";
import Link from "next/link";
import { Colophon } from "@/components/site/colophon";
import { Masthead } from "@/components/site/masthead";
import { SITE_NAV } from "@/components/site/nav";
import { INTENTS, type Intent } from "@/lib/intents";
import { STORE_URL, jsonLd, jsonLdScript, pageFor } from "@/lib/site";

/** One page per search: same document layout as the privacy page, one image, one install button. */
export function IntentPage({ intent }: { intent: Intent }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd(intent.path)) }}
      />
      <Masthead items={SITE_NAV} />
      <main className="spread spread-single">
        <article className="document">
          <section className="chapter" style={{ paddingTop: "clamp(44px,7vw,86px)" }}>
            <h1 className="lede-title">{intent.h1}</h1>
            <p className="lede">{intent.lede}</p>
            <div className="actions">
              <a className="btn-install" href={STORE_URL} target="_blank" rel="noopener">
                Add to Chrome
              </a>
              <Link className="btn-plain" href="/pricing">
                Pricing
              </Link>
            </div>
          </section>

          {intent.image && (
            <section className="chapter">
              <Image
                src={intent.image.src}
                alt={intent.image.alt}
                width={intent.image.width}
                height={intent.image.height}
                sizes="(min-width: 720px) 560px, 100vw"
                priority
                style={{ width: "100%", maxWidth: 420, height: "auto", borderRadius: 12, border: "1px solid var(--line)" }}
              />
            </section>
          )}

          {intent.sections.map((section) => (
            <section className="chapter" key={section.h}>
              <h2>{section.h}</h2>
              {section.p.map((text) => (
                <p key={text}>{text}</p>
              ))}
            </section>
          ))}

          {intent.steps && (
            <section className="chapter">
              <h2>How it goes</h2>
              <div className="ledger">
                {intent.steps.map((step) => (
                  <div key={step.b}>
                    <b>{step.b}</b>
                    <span>{step.span}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="chapter">
            <h2>Keep reading</h2>
            <ul>
              {intent.related.map((key) => (
                <li key={key}>
                  <Link href={INTENTS[key].path}>{pageFor(INTENTS[key].path).title}</Link>
                </li>
              ))}
              <li>
                <Link href="/privacy">What Axon does with your data</Link>
              </li>
            </ul>
          </section>
        </article>
      </main>
      <Colophon />
    </>
  );
}
