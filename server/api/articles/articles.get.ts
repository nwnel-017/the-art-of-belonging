import { getArticles } from "@server/services/articles.service";
import { serverSupabaseClient } from "#supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "#types/supabase/database";

export default defineEventHandler(async (event) => {
  const adminUser = await requireAdmin(event);

  const supabase = (await serverSupabaseClient(
    event
  )) as SupabaseClient<Database>;
  const data = await getArticles(supabase);
  if (!data) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch articles",
      },
    });
  }
  return data;
});
