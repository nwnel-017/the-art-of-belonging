// middleware/admin.ts

export default defineNuxtRouteMiddleware(async (to) => {
  const nuxtApp = useNuxtApp();
  const event = nuxtApp.ssrContext?.event;
  const config = useRuntimeConfig();

  let session;

  if (event) {
    console.log("event detected");
    // SSR: server can read cookies
    const { serverSupabaseClient } = await import(
      "../../server/utils/supabase"
    );
    const supabase = serverSupabaseClient(event);
    session = (await supabase.auth.getSession()).data.session;
    // console.log("session retrieved from ssr: " + JSON.stringify(session)); // works
  } else {
    // Client-side navigation: read session from browser storage
    const supabase = useSupabaseClient();
    session = (await supabase.auth.getSession()).data.session;
  }

  if (!session || session.user.email !== config.public.admin) {
    console.log("missing session!");
    return navigateTo("/admin/login");
  }
});
