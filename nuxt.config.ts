// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/styles/main.css"],
  runtimeConfig: {
    privateKey: process.env.PRIVATE_KEY || "", // server only
    public: {
      supabaseUrl: process.env.SUPABASE_PROJECT_URL || "", // client + server
      supabaseKey: process.env.SUPABASE_ANON_KEY || "",
      admin: process.env.ADMIN_EMAIL || "",
    },
  },
});
