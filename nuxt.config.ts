// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from "url";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/styles/main.css"],
  modules: ["@nuxtjs/supabase"],
  supabase: {
    redirect: false,
    url: process.env.SUPABASE_PROJECT_URL!,
    key: process.env.SUPABASE_ANON_KEY!,
  },
  runtimeConfig: {
    privateKey: process.env.PRIVATE_KEY, // server only
    public: {
      supabaseUrl: process.env.SUPABASE_PROJECT_URL, // client + server
      supabaseKey: process.env.SUPABASE_ANON_KEY,
      admin: process.env.ADMIN_EMAIL,
    },
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  alias: {
    "@server": fileURLToPath(new URL("./server", import.meta.url)),
    "#types": fileURLToPath(new URL("./types", import.meta.url)),
    "@utils": fileURLToPath(new URL("./utils", import.meta.url)),
  },
});
