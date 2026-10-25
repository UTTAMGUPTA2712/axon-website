import type { Metadata } from "next";
import { Colophon } from "@/components/site/colophon";
import { Masthead } from "@/components/site/masthead";

export const metadata: Metadata = {
  title: "Privacy policy — Axon",
  description:
    "Axon has no backend. Your keys stay in your browser, and page content goes only to the AI provider you configured.",
  alternates: { canonical: "/privacy" },
};

const NAV = [
  { href: "/", label: "Back to Axon" },
  { href: "/#keys", label: "Your keys" },
  { href: "/#questions", label: "Questions" },
];

export default function PrivacyPage() {
  return (
    <>
      <Masthead items={NAV} />
      <main className="spread spread-single">
        <article className="document">
          <section className="chapter" style={{ paddingTop: "clamp(44px,7vw,86px)" }}>
            <h1 className="lede-title">Privacy</h1>
            <p className="lede">
              Axon has no backend. Your keys stay in your browser, and page content goes
              only to the AI provider you configured — never to us, because there is no
              &quot;us&quot; in the request path.
            </p>
            <p className="standfirst">
              <span>
                Last updated <b>12 October 2026</b>
              </span>
            </p>
          </section>

          <section className="chapter">
            <h2>Information Collection and Use</h2>
            <ul>
              <li>
                <strong>User Input &amp; Screen Data</strong>: When you trigger the
                extension, we capture the selected text or a screenshot of your active tab.
              </li>
              <li>
                <strong>Personalization Data</strong>: We may store user preferences,
                facts, and professional details (your &quot;Digital Twin&quot;) derived
                from your interactions to improve response relevance.
              </li>
              <li>
                <strong>Processing</strong>: This data is sent directly from your browser
                to whichever AI provider you&apos;ve configured for that feature, using
                your own API key.
              </li>
              <li>
                <strong>No External Storage</strong>: We do <strong>not</strong> store,
                log, or share your screen data, text selections, profile data, or API keys
                on our servers. Axon has no backend of its own — all data is stored
                locally in your browser (<code>chrome.storage.sync</code>) or processed
                ephemerally by the provider you chose.
              </li>
            </ul>
          </section>

          <section className="chapter">
            <h2>Third-Party Services</h2>
            <p>
              Axon supports multiple AI providers, and you choose which one handles each
              feature (Chat, Vision, the intent router, and memory extraction). Depending
              on your configuration, requests may go to:
            </p>
            <ul>
              <li>
                <strong>Groq</strong> — see{" "}
                <a href="https://groq.com/privacy-policy/" target="_blank" rel="noopener">
                  Groq&apos;s Privacy Policy
                </a>
              </li>
              <li>
                <strong>OpenAI</strong> — see{" "}
                <a href="https://openai.com/policies/privacy-policy" target="_blank" rel="noopener">
                  OpenAI&apos;s Privacy Policy
                </a>
              </li>
              <li>
                <strong>Google Gemini</strong> — see{" "}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">
                  Google&apos;s Privacy Policy
                </a>
              </li>
            </ul>
            <p>Only the provider(s) you&apos;ve actually configured a key for ever receive your data.</p>
          </section>

          <section className="chapter">
            <h2>API Keys</h2>
            <p>
              Axon is bring-your-own-key: there is no shared or default key. Each key you
              add is stored locally on your device using Chrome&apos;s secure storage API (
              <code>chrome.storage.sync</code>). It is never transmitted to us or anyone
              other than the provider it belongs to, for authentication.
            </p>
          </section>

          <section className="chapter">
            <h2>Changes to This Policy</h2>
            <p>We may update this policy from time to time. Any changes will be posted on this page.</p>
          </section>

          <section className="chapter">
            <h2>Contact</h2>
            <p>
              If you have questions about this policy, please contact us via the Chrome Web
              Store support page or our GitHub repository.
            </p>
          </section>
        </article>
      </main>
      <Colophon about="privacy" />
    </>
  );
}
