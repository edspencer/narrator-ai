import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "NarratorAI",
  tagline: "AI-driven content generation for Node JS and React",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  // url: "https://edspencer.github.io",
  url: "https://narrator-ai.edspencer.net",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "edspencer", // Usually your GitHub org/user name.
  projectName: "narrator-ai", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "docusaurus-plugin-typedoc",
      {
        entryPoints: ["../../packages/narrator-ai/src/index.tsx"],
        tsconfig: "../../packages/narrator-ai/tsconfig.json",
        out: "./docs/api", // Output API docs under the 'api' folder
        exclude: ["**/__tests__/**", "**/*.test.ts"], // Exclude test files or other unwanted files
        excludePrivate: true, // Exclude private members
        excludeProtected: true, // Optionally exclude protected members
        includeVersion: false, // Include the version of the project in the generated docs
        readme: "none", // If you don't want a README in the generated docs
        hideGenerator: true, // Hide the "Generated by TypeDoc" text
        watch: process.env.NODE_ENV === "development",
        id: "narrator-ai",
      },
    ],
    [
      "docusaurus-plugin-typedoc",
      {
        entryPoints: ["../../packages/react/src/index.tsx"],
        tsconfig: "../../packages/react/tsconfig.json",
        out: "./docs/react", // Output API docs under the 'api' folder
        exclude: ["**/__tests__/**", "**/*.test.ts"], // Exclude test files or other unwanted files
        excludePrivate: true, // Exclude private members
        excludeProtected: true, // Optionally exclude protected members
        includeVersion: false, // Include the version of the project in the generated docs
        readme: "none", // If you don't want a README in the generated docs
        hideGenerator: true, // Hide the "Generated by TypeDoc" text
        watch: process.env.NODE_ENV === "development",
        id: "narrator-ai-react",
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    // image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "NarratorAI",
      logo: {
        alt: "NarratorAI Logo",
        src: "img/NarratorAI-logo.png",
      },
      items: [
        {
          position: "left",
          label: "Docs",
          type: "docSidebar",
          sidebarId: "docs",
        },
        {
          to: "/api/classes/Narrator",
          label: "API Reference",
          position: "left",
        },
        {
          to: "/react/functions/createNarrator",
          label: "React Reference",
          position: "left",
        },
        {
          href: "https://github.com/edspencer/narrator-ai",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Getting Started",
              to: "/",
            },
            {
              label: "Narrator API",
              to: "/api/classes/Narrator",
            },
          ],
        },
        {
          title: "Contact the Author",
          items: [
            {
              label: "Blog",
              href: "https://edspencer.net",
            },
            {
              label: "LinkedIn",
              href: "https://www.linkedin.com/in/edspencer85/",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/edspencer",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "https://edspencer.net/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/edspencer/narrator-ai",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Ed Spencer. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;