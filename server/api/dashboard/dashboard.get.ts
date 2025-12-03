import { getDashboardStats } from "../../utils/dashboard";
import { serverSupabaseClient } from "../../utils/supabase";
import { createError } from "#imports";

// To Do: separate this into just using separate reusable util/ functions instead of getting all together
export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseClient(event);

  const { artworkCount, postCount, orderCount } = await getDashboardStats(
    supabase
  );

  return {
    artworks: artworkCount || 0,
    posts: postCount || 0,
    orders: orderCount || 0,
  };
});
