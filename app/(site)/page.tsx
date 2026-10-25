import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Colophon } from "@/components/site/colophon";
import { Masthead } from "@/components/site/masthead";
import { Plans, PlansFallback } from "@/components/site/plans";
import { ReadingDock } from "@/components/site/reading-dock";
import {
  FAQ,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SOURCE_URL,
  STORE_URL,
  landingJsonLd,
} from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE_TITLE} | Bring your own API key`,
  description:
    "Axon is a free, open-source Chrome extension that reads the page you're on. Summarize long pages, ask questions about what's on screen, and fill forms from your own profile. Your API key stays in your browser — bring your own from Gemini, Groq, OpenAI or any OpenAI-compatible endpoint.",
  authors: [{ name: "Uttam Gupta" }],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Axon",
    url: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Axon — AI screen assistant for Chrome, with your own API key",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description:
      "Summarize any page, ask questions about what's on screen, and autofill forms from your own profile. Your API key stays in your browser.",
    images: [{ url: "/assets/og-image.png", alt: SITE_TITLE }],
  },
};

const NAV = [
  { href: "#does", label: "What it does", section: true },
  { href: "#keys", label: "Your keys", section: true },
  { href: "#setup", label: "Setup", section: true },
  { href: "#plans", label: "Plans", section: true },
  { href: "#questions", label: "Questions", section: true },
  { href: "/privacy", label: "Privacy" },
];

const INSTALL_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <path d="M12 3v12" />
    <path d="M7 11l5 5 5-5" />
    <path d="M4 20h16" />
  </svg>
);

export default function Landing() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(landingJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <Masthead items={NAV} />

      {/* The document on the left is the page; the panel on the right reads it. That is
          the product, demonstrated on the only page we can honestly demonstrate it on. */}
      <main className="spread">
        <article className="document" id="document">
          <section
            className="chapter is-current"
            id="intro"
            data-turn="intro"
            style={{ paddingTop: "clamp(44px,7vw,86px)" }}
          >
            <h1 className="lede-title">An AI layer over the page you&apos;re on.</h1>
            <p className="lede">
              <span className="mark">
                Axon docks beside the page you are reading and answers questions about it
              </span>{" "}
              — summarize something long, ask what a chart is showing, or fill a form from
              details you have saved.
            </p>

            <div className="actions">
              <a className="btn-install" href={STORE_URL} target="_blank" rel="noopener">
                {INSTALL_ICON}
                Add to Chrome
              </a>
              <a className="btn-plain" href={SOURCE_URL} target="_blank" rel="noopener">
                Read the source
              </a>
            </div>

            <p className="standfirst">
              <span>
                <b>Free</b> and open source
              </span>
              <span>
                <b>No account</b> to create
              </span>
              <span>
                <b>No backend</b> of its own
              </span>
            </p>
          </section>

          <section className="chapter" id="does" data-turn="does">
            <h2>What it does</h2>
            <p>Three things, all of them about the tab you already have open.</p>

            <h3 className="sub">Reads the page</h3>
            <p>
              Ask a question and Axon pulls the page&apos;s text, or takes a screenshot when
              the answer is visual, and sends only that to the model you chose.{" "}
              <span className="mark">
                It can transcribe a chart, work through an error trace, or cut a long
                thread down to its argument.
              </span>
            </p>

            <h3 className="sub">Fills forms</h3>
            <p>
              Axon matches form fields to details you have saved by meaning rather than by
              name, so a field labelled &quot;Mobile number&quot; is filled from a fact you
              saved as &quot;Phone&quot;. It reaches inside iframes and works on forms React
              and Vue render after load. It never fills passwords, card numbers or one-time
              codes, and never uses details you saved about someone else.
            </p>

            <h3 className="sub">Remembers what you tell it</h3>
            <p>
              Mention your role, a portfolio link or how you like things worded, and Axon
              keeps it — in your browser — so the next form and the next draft already know.
              You can read and edit every stored detail in settings, and delete any of them.
            </p>
          </section>

          <section className="chapter" id="keys" data-turn="keys">
            <h2>Where your keys and your data go</h2>
            <p>
              <span className="mark">There is no Axon server.</span> You bring a key from a
              provider you already trust, Axon keeps it in Chrome&apos;s own{" "}
              <code>chrome.storage.sync</code>, and requests go from your browser straight
              to that provider. Nothing is proxied, logged or kept by us, because there is
              no &quot;us&quot; in the request path at all.
            </p>

            <div className="ledger">
              <div>
                <b>Your API key</b>
                <span>
                  Held in <code>chrome.storage.sync</code>, sent only to the provider you
                  configured
                </span>
              </div>
              <div>
                <b>Page text</b>
                <span>
                  Read when you ask, sent with that one request, never stored outside the
                  tab&apos;s conversation
                </span>
              </div>
              <div>
                <b>Screenshots</b>
                <span>Taken only when you invoke Axon, and only of the tab you are on</span>
              </div>
              <div>
                <b>Your profile</b>
                <span>
                  Stays in your browser; you can read, edit and delete every entry in
                  settings
                </span>
              </div>
              <div>
                <b>Analytics</b>
                <span>None. There is no telemetry and no third-party script</span>
              </div>
            </div>
          </section>

          <section className="chapter" id="setup" data-turn="setup">
            <h2>Getting set up</h2>
            <p>About a minute, most of which is getting a key.</p>
            <div className="ledger">
              <div>
                <b>Install</b>
                <span>Add Axon from the Chrome Web Store</span>
              </div>
              <div>
                <b>Add a key</b>
                <span>
                  Settings opens on install. Paste a key from Google Gemini, which has a
                  free tier, or from Groq or OpenAI
                </span>
              </div>
              <div>
                <b>Pick models</b>
                <span>
                  Press Fetch models and assign one to chat, vision, routing and memory — or
                  leave the defaults
                </span>
              </div>
              <div>
                <b>Use it</b>
                <span>
                  Press <code>Ctrl+Shift+Y</code> on any page, or right-click a selection,
                  or open the side panel with <code>Ctrl+Shift+K</code>
                </span>
              </div>
            </div>
            <p style={{ marginTop: 22 }}>
              Prefer nothing leave your machine at all? Point the custom provider at Ollama
              or LM Studio and Axon will talk to a model running locally.
            </p>
          </section>

          <section className="chapter" id="plans" data-turn="plans">
            <h2>If you would rather not hold a key</h2>
            <p>
              Everything above works with a key of your own and no account. An Axon account
              is the alternative: prompts run on our servers against a daily allowance, and
              the only thing you configure is which model to use.
            </p>

            <Suspense fallback={<PlansFallback />}>
              <Plans />
            </Suspense>
          </section>

          <section className="chapter" id="questions" data-turn="questions">
            <h2>Questions</h2>
            <div className="qa">
              {FAQ.map(({ q, a }) => (
                <div key={q}>
                  <h3>{q}</h3>
                  <p>{a}</p>
                </div>
              ))}
            </div>

            <div className="actions" style={{ marginTop: 34 }}>
              <a className="btn-install" href={STORE_URL} target="_blank" rel="noopener">
                Add to Chrome
              </a>
              <Link className="btn-plain" href="/privacy">
                Read the privacy policy
              </Link>
            </div>
          </section>
        </article>

        <ReadingDock />
      </main>

      <Colophon about="landing" />
    </>
  );
}
