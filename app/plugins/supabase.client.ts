// To Do: delete this file
// we are using the built-in browserSupabaseClient from #supabase/browser
// having this file causes errors - cannot redefine $supabase

// import { createBrowserClient } from "@supabase/ssr";

// export default defineNuxtPlugin(() => {
//   const config = useRuntimeConfig();

//   // No cookies here
//   const supabase = createBrowserClient(
//     config.public.supabaseUrl,
//     config.public.supabaseKey
//   );

//   return {
//     provide: { supabase },
//   };
// });
