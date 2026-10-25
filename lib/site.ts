/**
 * Where the public pages live and where they point.
 *
 * AXON_SITE_URL is the origin this app is served from. It feeds canonical links,
 * Open Graph URLs, the sitemap and the structured data. Production defaults to the
 * deployment the extension signs in against (AXON_ENVIRONMENTS.hosted.app in
 * axon-ai), so a custom domain is one environment variable, set on both sides.
 */
export const SITE_URL = (
  process.env.AXON_SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://axon-ai-assistant.vercel.app"
    : "http://localhost:3002")
).replace(/\/+$/, "");

export const STORE_URL =
  "https://chromewebstore.google.com/detail/axon-screen-assistant/edhnfkobaggakaghcmogeeginaebcifm";
export const SOURCE_URL = "https://github.com/UTTAMGUPTA2712";
export const AUTHOR_URL = "https://uttamgupta2712.is-a.dev/";
export const AUTHOR_ID = `${AUTHOR_URL}#uttam`;

export const SITE_TITLE = "Axon — AI screen assistant for Chrome";
export const SITE_DESCRIPTION =
  "Summarize any page, ask questions about what's on screen, and autofill forms from your own profile. Free, open-source, and your API key never leaves your browser.";

export const FAQ = [
  {
    q: "Is Axon free to use?",
    a: "Yes. Axon is free and open-source. You bring your own API key from a provider such as Google Gemini, which has a generous free tier, Groq, or OpenAI. You can also point it at a local model through any OpenAI-compatible endpoint, which costs nothing to run.",
  },
  {
    q: "Where are my API keys stored?",
    a: "In your browser, in Chrome's own chrome.storage.sync area. There is no Axon server: keys are sent only to the provider endpoint you configured, directly from your browser.",
  },
  {
    q: "Which AI models does Axon support?",
    a: "Google Gemini, Groq, and OpenAI are built in, and a custom provider works with any OpenAI-compatible endpoint, including Ollama and LM Studio running on your own machine. You can assign a different model to chat, vision, intent routing and memory.",
  },
  {
    q: "Does Axon track my browsing history or screen data?",
    a: "No. Axon reads the page or captures the screen only when you invoke it, through the toolbar icon, a keyboard shortcut or the right-click menu. It requests no browsing-history permission, and Chrome grants it access to a page only for that visit.",
  },
] as const;

/** schema.org graph for the landing page. The author node reuses the portfolio's @id. */
export function landingJsonLd() {
  const page = `${SITE_URL}/`;
  const og = `${SITE_URL}/assets/og-image.png`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${page}#website`,
        url: page,
        name: "Axon",
        description: "AI screen assistant for Chrome, with your own API key.",
        inLanguage: "en",
        publisher: { "@id": AUTHOR_ID },
        author: { "@id": AUTHOR_ID },
      },
      {
        "@type": "WebPage",
        "@id": `${page}#webpage`,
        url: page,
        name: SITE_TITLE,
        description:
          "Summarize any page, ask questions about what is on screen, and autofill forms from your own profile.",
        isPartOf: { "@id": `${page}#website` },
        about: { "@id": `${page}#app` },
        primaryImageOfPage: { "@id": `${page}#ogimage` },
        inLanguage: "en",
      },
      {
        "@type": "ImageObject",
        "@id": `${page}#ogimage`,
        url: og,
        contentUrl: og,
        width: 1200,
        height: 630,
        caption: SITE_TITLE,
      },
      {
        "@type": ["SoftwareApplication", "BrowserExtension"],
        "@id": `${page}#app`,
        name: "Axon — AI screen assistant, bring your own key",
        alternateName: "Axon",
        url: page,
        applicationCategory: "BrowserApplication",
        applicationSubCategory: "Chrome Extension",
        operatingSystem: "Chrome 114+, Windows, macOS, Linux, ChromeOS",
        browserRequirements:
          "Requires Google Chrome or another Chromium browser with Manifest V3 support.",
        softwareVersion: "3.0",
        description:
          "Axon adds an AI layer to the page you are on: it reads the screen, summarizes long pages, answers questions about what is visible, and fills forms from a profile you control. You supply your own API key, which is stored in your browser and sent only to the provider you chose.",
        featureList: [
          "Ask questions about the page you are on",
          "Summarize long pages and selected text",
          "Read the screen with a vision model",
          "Fill forms from a profile you control",
          "Bring your own key: Gemini, Groq, OpenAI, or any OpenAI-compatible endpoint",
          "Runs in a side panel or an in-page overlay",
        ],
        image: { "@id": `${page}#ogimage` },
        screenshot: `${SITE_URL}/assets/panel.png`,
        installUrl: STORE_URL,
        downloadUrl: STORE_URL,
        privacyPolicy: `${SITE_URL}/privacy`,
        isAccessibleForFree: true,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        author: { "@id": AUTHOR_ID },
        publisher: { "@id": AUTHOR_ID },
        maintainer: { "@id": AUTHOR_ID },
        sameAs: [STORE_URL, "https://github.com/UTTAMGUPTA2712/axon"],
      },
      {
        "@type": "Person",
        "@id": AUTHOR_ID,
        name: "Uttam Gupta",
        givenName: "Uttam",
        familyName: "Gupta",
        url: AUTHOR_URL,
        jobTitle: "Lead Backend & Distributed Systems Engineer",
        sameAs: [
          AUTHOR_URL,
          "https://github.com/UTTAMGUPTA2712",
          "https://www.linkedin.com/in/uttam-gupta-a185a8239/",
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${page}#faq`,
        isPartOf: { "@id": `${page}#webpage` },
        mainEntity: FAQ.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };
}
