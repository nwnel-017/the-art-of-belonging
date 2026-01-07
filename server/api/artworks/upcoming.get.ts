import { serverSupabaseClient } from "#supabase/server";
import { getUpcomingArtworks } from "@server/services/artworks.service";

export default defineEventHandler(async (event) => {
  const adminUser = await requireAdmin(event);

  try {
    const supabase = await serverSupabaseClient(event);
    const data = await getUpcomingArtworks(supabase);
    return data;
  } catch (err) {
    console.log("Error fetching upcoming artworks: " + err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch upcoming artworks",
      },
    });
  }
});
