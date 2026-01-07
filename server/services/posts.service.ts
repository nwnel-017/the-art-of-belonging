import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";

export async function getPostCount(supabase: SupabaseClient<Database>) {
  const { count: postCount, error: postError } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true });

  if (postError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch total post count",
        details: postError.message,
      },
    });
  }

  return postCount || 0;
}
