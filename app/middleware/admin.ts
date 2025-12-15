// middleware/admin.ts

export default defineNuxtRouteMiddleware(async (to) => {
  console.log("Running admin middleware");
  const nuxtApp = useNuxtApp();
  const config = useRuntimeConfig();
  const user = useSupabaseUser();

  console.log("admin middleware triggered");

  if (!user.value) {
    console.log("no user value, redirecting to login");
    return navigateTo("/admin/login");
  }

  if (user.value.email !== config.public.admin) {
    console.log("user is not admin, redirecting to login");
    return navigateTo("/admin/login");
  }
});
