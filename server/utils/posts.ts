import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../supabase.types";

export async function getPostCount(supabase: SupabaseClient<Database>) {
  const { count: postCount, error: postError } = await supabase
    .from("posts")
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
