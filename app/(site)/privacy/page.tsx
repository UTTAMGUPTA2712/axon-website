import { Colophon } from "@/components/site/colophon";
import { Masthead } from "@/components/site/masthead";
import { SITE_NAV } from "@/components/site/nav";
import { DATA, jsonLd, jsonLdScript, metadataFor } from "@/lib/site";

export const metadata = metadataFor("/privacy");

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd("/privacy")) }}
      />
      <Masthead items={SITE_NAV} />
      <main className="spread spread-single">
        <article className="document">
          <section className="chapter" style={{ paddingTop: "clamp(44px,7vw,86px)" }}>
            <h1 className="lede-title">Privacy</h1>
            <p className="lede">
              Axon works in two modes, and they handle your data differently. With a key
              of your own it runs in your browser and nothing reaches us. If you sign in,
              your prompts run on our server and are stored. You choose, and you can
              switch.
            </p>
            <p className="standfirst">
              <span>
                Last updated <b>27 October 2026</b>
              </span>
            </p>
          </section>

          <section className="chapter">
            <h2>Mode 1: your own API key (signed out)</h2>
            <p>{DATA.signedOut}</p>
            <ul>
              <li>
                <strong>Screen and page data</strong>: when you invoke Axon, it reads the
                selected text or page, or captures a screenshot of your active tab, and
                sends it with your question to the provider you configured, using your
                own key.
              </li>
              <li>
                <strong>Personalization data</strong>: preferences, facts and professional
                details Axon learns from your chats are stored in your browser
                (<code>chrome.storage.sync</code>). You can read, edit and delete every
                entry in settings.
              </li>
              <li>
                <strong>What we receive</strong>: nothing. In this mode the Axon extension
                makes no request to an Axon server.
              </li>
            </ul>
          </section>

          <section className="chapter">
            <h2>Mode 2: an Axon account (signed in)</h2>
            <p>
              Signing in is optional. You do it on this website, never inside the
              extension, and the extension is handed a session by a one-time code.{" "}
              {DATA.signedIn}
            </p>
            <ul>
              <li>
                <strong>Account data</strong>: your email address, name if you give one,
                a salted hash of your password (never the password), your plan and its
                billing status.
              </li>
              <li>
                <strong>Prompts</strong>: for each request, your question, the messages
                the model was given (including the page text sent with it), the model&apos;s
                answer, the provider and model used, token counts and latency. Screenshots
                are forwarded to the model but are not kept.
              </li>
              <li>
                <strong>Failures</strong>: when a request fails we record the provider, model,
                status code and the provider&apos;s error text with credentials removed, so
                we can tell a provider outage from a bug.
              </li>
              <li>
                <strong>Usage</strong>: a daily count of prompts, to apply your plan&apos;s
                allowance.
              </li>
              <li>
                <strong>Payments</strong>: paid plans are billed by Razorpay. We keep the
                subscription&apos;s status and dates; card details go to Razorpay and not to us.
              </li>
              <li>
                <strong>Your own keys</strong>: {DATA.keys}
              </li>
            </ul>
          </section>

          <section className="chapter">
            <h2>No analytics</h2>
            <p>
              Neither the extension nor this website includes analytics, telemetry or
              third-party scripts.
            </p>
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
            <p>With your own key, only the provider(s) you&apos;ve configured a key for receive your data. When you are signed in, Axon&apos;s server forwards your request to the provider that serves your account&apos;s model, so that provider receives it instead.</p>
          </section>

          <section className="chapter">
            <h2>API Keys</h2>
            <p>
              Signed out, Axon is bring-your-own-key: there is no shared or default key. Each
              key you add is stored locally on your device using Chrome&apos;s storage API (
              <code>chrome.storage.sync</code>). It is never transmitted to us, signed in or
              not, and goes only to the provider it belongs to, for authentication.
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
      <Colophon />
    </>
  );
}
