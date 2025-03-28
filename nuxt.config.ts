// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  runtimeConfig: {
    graphToken: process.env.GRAPH_TOKEN ?? "graphToken_server",
    public: {
      alchemyKey: process.env.ALCHEMY_KEY ?? "alchemyKey_na",
      graphToken: process.env.GRAPH_TOKEN ?? "graphToken_na",
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/color-mode", "@nuxt/content"],
  content: {
    highlight: {
      theme: {
        default: "min-light",
        dark: "min-dark",
      },
    },
  },
  colorMode: {
    classSuffix: "",
  },
  nitro: {
    prerender: {
      routes: ["/sitemap.xml"],
    },
  },
  future: {
    compatibilityVersion: 4,
  },
});
