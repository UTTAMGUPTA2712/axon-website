import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Axon — Screen Assistant",
    short_name: "Axon",
    description:
      "AI screen assistant for Chrome. Summarize pages, ask about what's on screen, and fill forms — with your own API key.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0e1117",
    theme_color: "#0e1117",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
