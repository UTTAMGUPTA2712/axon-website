/**
 * The pages that answer one search each. Content only: components/site/intent-page.tsx
 * renders it, and each route is a few lines that name its entry here. The title and
 * description live in PAGES (lib/site.ts) so the sitemap and the metadata agree.
 */
export interface Intent {
  path: string;
  h1: string;
  lede: string;
  image?: { src: string; alt: string; width: number; height: number };
  sections: readonly { h: string; p: readonly string[] }[];
  /** Short label then sentence, rendered as the ledger used elsewhere on the site. */
  steps?: readonly { b: string; span: string }[];
  /** Other intent pages worth reading next. */
  related: readonly string[];
}

export const INTENTS: Record<string, Intent> = {
  summarize: {
    path: "/summarize-webpage-with-ai",
    h1: "Summarize any webpage with AI",
    lede: "Axon reads the page you have open and cuts it down to what it argues, without you copying anything into a chat window.",
    image: {
      src: "/assets/hero.webp",
      alt: "A browser showing a travel website with the Axon assistant docked in a panel on the right, analysing the page",
      width: 768,
      height: 768,
    },
    sections: [
      {
        h: "What gets summarized",
        p: [
          "The whole page, or just the text you have selected. Axon pulls the page's text, so a long article, a forum thread, documentation or a report is read as written rather than as a screenshot of it.",
          "Ask for a different shape if the default is not what you need: key points, a one-paragraph version, or only the part about pricing.",
        ],
      },
      {
        h: "Which model does the work",
        p: [
          "You choose. Use your own Gemini, Groq or OpenAI key, a local model through any OpenAI-compatible endpoint, or sign in to an Axon account and run it on Axon's server. With your own key, the page text goes from your browser straight to that provider and nowhere else.",
        ],
      },
    ],
    steps: [
      { b: "Open the page", span: "Any normal web page; Chrome's own pages are off limits to every extension" },
      { b: "Invoke Axon", span: "Ctrl+Shift+Y, the toolbar icon, or right-click a selection" },
      { b: "Ask", span: "Choose Summarize, or type what you want from the page" },
    ],
    related: ["ask-screen", "byok"],
  },
  "ask-screen": {
    path: "/ask-ai-about-your-screen",
    h1: "Ask AI about what's on your screen",
    lede: "When the answer is in a chart, an error dialog or a design, Axon captures the visible tab and asks a vision model about it.",
    image: {
      src: "/assets/panel.png",
      alt: "The Axon side panel open beside a web page, showing a question and the model's answer",
      width: 800,
      height: 1240,
    },
    sections: [
      {
        h: "Only when you ask",
        p: [
          "Axon takes a screenshot only when you invoke it, and only of the tab you are on. It declares no standing access to your sites: Chrome grants it the current page for that visit and takes the access back when you navigate.",
        ],
      },
      {
        h: "What it is good for",
        p: [
          "Transcribing a chart, explaining an error message, describing what a layout is doing, or reading text that is an image and not text. For anything that is plain text, Axon reads the text itself, which is cheaper and more exact.",
          "Axon routes each question for you, so you do not have to decide between reading the page and looking at the screen.",
        ],
      },
    ],
    steps: [
      { b: "Capture", span: "Ctrl+Shift+U captures the screen and opens the question box" },
      { b: "Ask", span: "What does this error mean? What is this chart showing?" },
      { b: "Follow up", span: "The conversation stays in the side panel for the rest of the tab's visit" },
    ],
    related: ["summarize", "byok"],
  },
  autofill: {
    path: "/ai-form-autofill",
    h1: "AI form autofill for Chrome",
    lede: "Axon matches form fields to details you have saved by meaning, so a field labelled \"Mobile number\" is filled from a fact you saved as \"Phone\".",
    image: {
      src: "/assets/autofill.webp",
      alt: "A form with a Fill with Axon button above name and address fields that have just been filled in",
      width: 768,
      height: 768,
    },
    sections: [
      {
        h: "Works where ordinary autofill gives up",
        p: [
          "It reaches inside iframes and fills forms that React and Vue render after the page has loaded. You can also say what you want in words: put my work email in the subscription box.",
        ],
      },
      {
        h: "What it will not fill",
        p: [
          "Passwords, card numbers and one-time codes are never filled, and Axon never uses details you saved about someone else.",
        ],
      },
      {
        h: "Your details, your control",
        p: [
          "Mention your role, a portfolio link or how you like things worded, and Axon keeps it so the next form already knows. Every stored detail is listed in settings, where you can read, edit or delete it. Signed out, the profile stays in your browser; signed in, it is kept with your account so it follows you across browsers.",
        ],
      },
    ],
    steps: [
      { b: "Save a detail", span: "Tell Axon, or add it in settings" },
      { b: "Open the form", span: "Any form on any page you have opened Axon on" },
      { b: "Fill", span: "Use the Autofill command or ask in the chat" },
    ],
    related: ["byok", "summarize"],
  },
  byok: {
    path: "/bring-your-own-key-ai-extension",
    h1: "A bring-your-own-key AI extension for Chrome",
    lede: "Paste a key from Gemini, Groq or OpenAI, or point Axon at a local model. The key stays in your browser and requests go straight to the provider.",
    image: {
      src: "/assets/panel.png",
      alt: "The Axon side panel open beside a web page",
      width: 800,
      height: 1240,
    },
    sections: [
      {
        h: "Where the key lives",
        p: [
          "In Chrome's own chrome.storage.sync, on your machine. Signed out, nothing you do with Axon passes through an Axon server: the page text or screenshot goes from your browser to the provider you configured, with your key, and the answer comes straight back.",
          "Axon never sends your own API keys to its server, even if you later sign in.",
        ],
      },
      {
        h: "Which providers",
        p: [
          "Google Gemini, which has a free tier, Groq and OpenAI are built in. A custom provider works with any OpenAI-compatible endpoint, including Ollama and LM Studio on your own machine, so nothing needs to leave it at all. You can assign a different model to chat, vision, intent routing and memory.",
        ],
      },
      {
        h: "If you would rather not hold a key",
        p: [
          "An Axon account is optional and is the alternative: prompts run on Axon's server against a daily allowance. See pricing for what the plans include, and the privacy policy for what the server keeps.",
        ],
      },
    ],
    steps: [
      { b: "Install", span: "Add Axon from the Chrome Web Store" },
      { b: "Add a key", span: "Settings opens on install; paste a key from your provider" },
      { b: "Pick models", span: "Press Fetch models, or leave the defaults" },
    ],
    related: ["summarize", "autofill"],
  },
};
