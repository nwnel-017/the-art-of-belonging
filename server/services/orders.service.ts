import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";

export async function getOrderCount(supabase: SupabaseClient<Database>) {
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

  return orderCount || 0;
}
