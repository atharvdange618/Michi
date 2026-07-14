import { defineConfig } from "blume";

export default defineConfig({
  title: "Michi",
  description:
    "A client-side router built from first principles. No routing libraries, no framework abstractions, just the raw History API and React primitives.",
  logo: {
    image: {
      light: "/logo-light.svg",
      dark: "/logo-dark.svg",
    },
    text: "Michi",
  },
  content: {
    root: "docs",
  },
  github: {
    owner: "atharvdange618",
    repo: "Michi",
  },
  lastModified: true,
  theme: {
    accent: "neutral",
    radius: "md",
    mode: "system",
    fonts: {
      display: "inter-tight",
      body: "inter",
      mono: "ibm-plex-mono",
    },
  },
  search: {
    provider: "orama",
  },
  analytics: {
    scripts: [
      {
        src: "https://usetelemetry.hogyoku.cloud/analytics.js",
        strategy: "defer",
        attributes: { "data-tenant-id": "cmqt53wq5000efmdsat5sgsog" },
      },
    ],
  },
  markdown: {
    imageZoom: true,
    code: {
      icons: true,
      wrap: false,
    },
    codeBlocks: {
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  toc: {
    minHeadingLevel: 2,
    maxHeadingLevel: 3,
  },
  seo: {
    og: { enabled: true },
    rss: { enabled: true, types: ["blog"] },
    sitemap: true,
    robots: true,
    structuredData: true,
  },
  deployment: {
    output: "static",
  },
});
