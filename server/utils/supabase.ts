import { createServerClient } from "@supabase/ssr";
import type { H3Event } from "h3";
import * as cookie from "cookie";
import { setCookie } from "h3";

export function serverSupabaseClient(event: H3Event) {
  const config = useRuntimeConfig();
  return createServerClient(
    config.public.supabaseUrl,
    config.public.supabaseKey,
    {
      cookies: {
        getAll: (): { name: string; value: string }[] => {
          const header = event.node.req.headers.cookie ?? "";
          const parsed = cookie.parse(header);
          return Object.entries(parsed).map(([name, value]) => ({
            name,
            value: value ?? "",
          }));
        },
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie(event, name, value, options);
          });
        },
      },
    }
  );
}
