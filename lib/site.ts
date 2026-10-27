/**
 * Where the public pages live, what they call themselves, and what they claim.
 *
 * AXON_SITE_URL is the origin this app is served from. It feeds canonical links,
 * Open Graph URLs, the sitemap and the structured data. Production defaults to the
 * deployment the extension signs in against (AXON_ENVIRONMENTS.hosted.app in
 * ask-ai), so a custom domain is one environment variable, set on both sides.
 * This is the only marketing origin: the old static site redirects here.
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

/** Matches ask-ai/manifest.json "version"; lib/site.spec.ts fails if they drift. */
export const EXTENSION_VERSION = "3.0";

/*
  One name, one tagline. The Chrome Web Store listing and the extension manifest use
  the same SITE_TITLE; "Axon account" and "Axon console" are surface names, not the
  product's.
*/
export const SITE_NAME = "Axon";
export const SITE_TITLE = "Axon — AI screen assistant for Chrome";
export const SITE_TAGLINE = "An AI layer over the page you're on.";
export const SITE_DESCRIPTION =
  "Summarize any page, ask about what's on screen, and autofill forms. Use your own API key, which stays in your browser, or sign in for a hosted allowance.";

/**
 * What Axon does with data, in the words every page uses. The privacy policy, the FAQ,
 * the structured data and the descriptions all draw on these so that the two modes are
 * described the same way everywhere, and lib/site.spec.ts can fail the build if a page
 * goes back to saying there is no server.
 */
export const DATA = {
  signedOut:
    "Signed out, Axon runs entirely in your browser. Your API key stays in Chrome's own storage and requests go from your browser straight to the provider you chose. Nothing passes through an Axon server.",
  signedIn:
    "Signed in, prompts run on Axon's server instead: your question, the page text sent with it and the model's answer pass through it and are stored against your account, so we can enforce your daily allowance and diagnose failures. Screenshots are forwarded to the model but not kept. Signing in is always optional.",
  keys: "Your own API keys are never sent to Axon, signed in or not.",
} as const;

export const FAQ = [
  {
    q: "Is Axon free to use?",
    a: "Yes. Axon is free and open-source. Bring your own API key from a provider such as Google Gemini, which has a generous free tier, Groq or OpenAI, or point it at a local model through any OpenAI-compatible endpoint. If you would rather not hold a key, an Axon account gives you a daily allowance of hosted prompts, with paid plans for more.",
  },
  {
    q: "Where are my API keys stored?",
    a: `In your browser, in Chrome's own chrome.storage.sync area. ${DATA.keys} With a key of your own, requests go from your browser directly to the provider you configured.`,
  },
  {
    q: "Do I need an account?",
    a: "No. Axon works with no account at all, using a key you supply. An account is optional and only needed if you want prompts to run on Axon's servers instead. You sign in on this site, never inside the extension.",
  },
  {
    q: "What happens to my data if I sign in?",
    a: DATA.signedIn,
  },
  {
    q: "Which AI models does Axon support?",
    a: "Google Gemini, Groq, and OpenAI are built in, and a custom provider works with any OpenAI-compatible endpoint, including Ollama and LM Studio running on your own machine. You can assign a different model to chat, vision, intent routing and memory.",
  },
  {
    q: "Does Axon track my browsing history or screen data?",
    a: "No. Axon reads the page or captures the screen only when you invoke it, through the toolbar icon, a keyboard shortcut or the right-click menu. It requests no browsing-history permission, and Chrome grants it access to a page only for that visit. It includes no analytics or third-party scripts.",
  },
] as const;

/**
 * Every indexable page, once. The sitemap, the footer, the breadcrumbs and each page's
 * metadata read this, so a page cannot be in one and missing from another. `updated` is
 * the date the page's content last changed, and it is the sitemap's lastModified.
 */
export interface SitePage {
  path: string;
  /** Becomes `<title>` through the root layout's template, which appends the name. */
  title: string;
  /** Shown in the nav and the breadcrumb. */
  label: string;
  description: string;
  updated: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}

export const PAGES: readonly SitePage[] = [
  {
    path: "/",
    title: SITE_TITLE,
    label: "Axon",
    description: SITE_DESCRIPTION,
    updated: "2026-10-27",
    priority: 1,
    changeFrequency: "monthly",
  },
  {
    path: "/summarize-webpage-with-ai",
    title: "Summarize any webpage with AI",
    label: "Summarize",
    description:
      "Cut a long article, thread or document down to its argument without leaving the tab. Axon summarizes the page you have open with a model you choose.",
    updated: "2026-10-27",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/ask-ai-about-your-screen",
    title: "Ask AI about what's on your screen",
    label: "Ask the screen",
    description:
      "Capture the visible tab and ask a vision model about a chart, an error or a design. Axon reads the screen only when you invoke it.",
    updated: "2026-10-27",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/ai-form-autofill",
    title: "AI form autofill for Chrome",
    label: "Autofill",
    description:
      "Fill forms from details you have saved, matched by meaning rather than field name. Never passwords, card numbers or one-time codes.",
    updated: "2026-10-27",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/bring-your-own-key-ai-extension",
    title: "Bring-your-own-key AI extension for Chrome",
    label: "Your own key",
    description:
      "Use Gemini, Groq, OpenAI or a local model with your own API key in Chrome. The key stays in your browser and requests go straight to the provider.",
    updated: "2026-10-27",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/pricing",
    title: "Pricing",
    label: "Pricing",
    description:
      "Axon is free with your own API key. An Axon account adds a daily allowance of hosted prompts, with paid plans for more.",
    updated: "2026-10-27",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/privacy",
    title: "Privacy policy",
    label: "Privacy",
    description:
      "How Axon handles your data in both modes: local-only with your own key, or through Axon's server when you sign in.",
    updated: "2026-10-27",
    priority: 0.4,
    changeFrequency: "yearly",
  },
];

export function pageFor(path: string): SitePage {
  const page = PAGES.find((p) => p.path === path);
  if (!page) throw new Error(`lib/site.ts: no page registered for ${path}`);
  return page;
}

const OG_IMAGE = "/assets/og-image.png";
const OG_ALT = `${SITE_TITLE}: ${SITE_TAGLINE}`;

/**
 * Metadata for a registered page: its own title and description, a self-canonical, and
 * Open Graph and Twitter cards that say the same thing. Relative URLs resolve against
 * metadataBase in the root layout.
 */
export function metadataFor(path: string) {
  const page = pageFor(path);
  const title = path === "/" ? { absolute: SITE_TITLE } : page.title;
  const social = path === "/" ? SITE_TITLE : `${page.title} — ${SITE_NAME}`;
  return {
    title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website" as const,
      locale: "en_US",
      siteName: SITE_NAME,
      url: path,
      title: social,
      description: page.description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, type: "image/png", alt: OG_ALT }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title: social,
      description: page.description,
      images: [{ url: OG_IMAGE, alt: OG_ALT }],
    },
  };
}

const ORG_ID = `${SITE_URL}/#organization`;

/** What a plan costs, as the landing and pricing pages read it from the API. */
export interface PlanOffer {
  name: string;
  /** Minor units, as the API stores them. */
  amount: number;
  currency: string;
}

function offersFor(plans: readonly PlanOffer[] | null) {
  const free = {
    "@type": "Offer",
    name: "Your own API key",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  };
  if (!plans?.length) return [free];
  return [
    free,
    ...plans.map((plan) => ({
      "@type": "Offer",
      name: plan.name,
      price: (plan.amount / 100).toFixed(2),
      priceCurrency: plan.currency,
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/pricing`,
    })),
  ];
}

/** Organization and WebSite: the nodes every page's graph refers to. */
function siteNodes() {
  return [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon-512.png`,
        width: 512,
        height: 512,
      },
      founder: { "@id": AUTHOR_ID },
      sameAs: [STORE_URL, SOURCE_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
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
  ];
}

function breadcrumb(path: string) {
  const home = pageFor("/");
  const here = pageFor(path);
  const items = path === "/" ? [home] : [home, here];
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${path}#breadcrumb`,
    itemListElement: items.map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: page.label,
      item: `${SITE_URL}${page.path}`,
    })),
  };
}

function webPage(path: string) {
  const page = pageFor(path);
  const url = `${SITE_URL}${path}`;
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: path === "/" ? SITE_TITLE : `${page.title} — ${SITE_NAME}`,
    description: page.description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    primaryImageOfPage: { "@id": `${SITE_URL}/#ogimage` },
    dateModified: page.updated,
    inLanguage: "en",
  };
}

const ogImageNode = () => ({
  "@type": "ImageObject",
  "@id": `${SITE_URL}/#ogimage`,
  url: `${SITE_URL}${OG_IMAGE}`,
  contentUrl: `${SITE_URL}${OG_IMAGE}`,
  width: 1200,
  height: 630,
  caption: SITE_TITLE,
});

function appNode(plans: readonly PlanOffer[] | null) {
  return {
    "@type": ["SoftwareApplication", "BrowserExtension"],
    "@id": `${SITE_URL}/#app`,
    name: SITE_TITLE,
    alternateName: SITE_NAME,
    url: `${SITE_URL}/`,
    applicationCategory: "BrowserApplication",
    applicationSubCategory: "Chrome Extension",
    operatingSystem: "Chrome 114+, Windows, macOS, Linux, ChromeOS",
    browserRequirements:
      "Requires Google Chrome or another Chromium browser with Manifest V3 support.",
    softwareVersion: EXTENSION_VERSION,
    description:
      "Axon adds an AI layer to the page you are on: it reads the screen, summarizes long pages, answers questions about what is visible, and fills forms from a profile you control. Use your own API key, stored in your browser and sent only to the provider you chose, or sign in to run prompts on Axon's server.",
    featureList: [
      "Ask questions about the page you are on",
      "Summarize long pages and selected text",
      "Read the screen with a vision model",
      "Fill forms from a profile you control",
      "Bring your own key: Gemini, Groq, OpenAI, or any OpenAI-compatible endpoint",
      "Optional account with a hosted daily allowance",
      "Runs in a side panel or an in-page overlay",
    ],
    image: { "@id": `${SITE_URL}/#ogimage` },
    screenshot: `${SITE_URL}/assets/panel.png`,
    installUrl: STORE_URL,
    downloadUrl: STORE_URL,
    privacyPolicy: `${SITE_URL}/privacy`,
    isAccessibleForFree: true,
    offers: offersFor(plans),
    author: { "@id": AUTHOR_ID },
    publisher: { "@id": ORG_ID },
    sameAs: [STORE_URL, `${SOURCE_URL}/axon`],
  };
}

/** schema.org graph for one page: the site nodes, the page, its breadcrumb, and extras. */
export function jsonLd(path: string, extra: readonly object[] = []) {
  return {
    "@context": "https://schema.org",
    "@graph": [...siteNodes(), ogImageNode(), webPage(path), breadcrumb(path), ...extra],
  };
}

/** The landing page's graph: the application and its FAQ on top of the common nodes. */
export function landingJsonLd(plans: readonly PlanOffer[] | null) {
  return jsonLd("/", [
    appNode(plans),
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      isPartOf: { "@id": `${SITE_URL}/#webpage` },
      mainEntity: FAQ.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ]);
}

/** Serialised for a script tag: a `<` in the data cannot close it. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
