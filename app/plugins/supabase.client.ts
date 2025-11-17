import { createBrowserClient } from "@supabase/ssr";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  // No cookies here
  const supabase = createBrowserClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  );

  return {
    provide: { supabase },
  };
});
