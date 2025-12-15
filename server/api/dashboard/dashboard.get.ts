// import { getDashboardStats } from "../../utils/dashboard";
import { getDashboardStats } from "@server/services/dashboard.service";
import { serverSupabaseClient } from "#supabase/server";
import { createError } from "#imports";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "#types/supabase/database";

// To Do: separate this into just using separate reusable util/ functions instead of getting all together
export default defineEventHandler(async (event) => {
  const supabase = (await serverSupabaseClient(
    event
  )) as SupabaseClient<Database>;

  const { artworkCount, postCount, orderCount } = await getDashboardStats(
    supabase
  );

  return {
    artworks: artworkCount || 0,
    posts: postCount || 0,
    orders: orderCount || 0,
  };
});
