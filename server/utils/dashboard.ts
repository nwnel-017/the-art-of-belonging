import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../supabase.types";

export async function getDashboardStats(supabase: SupabaseClient<Database>) {
  const { count: artworkCount, error: artError } = await supabase
    .from("artworks")
    .select("id", { count: "exact", head: true });

  if (artError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch total artwork count",
        details: artError.message,
      },
    });
  }

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

  const { count: orderCount, error: orderError } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true });

  if (orderError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch total order count",
        details: orderError.message,
      },
    });
  }

  return { artworkCount, postCount, orderCount };
}
