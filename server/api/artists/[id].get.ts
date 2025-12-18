import { requireAdmin } from "@server/utils/auth/requireAdmin";
import { serverSupabaseClient } from "#supabase/server";
import { getArtistDetails } from "@server/services/artists.service";

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event);

  const id = event.context.params?.id as string;

  console.log("Fetching details for artist ID:", JSON.stringify(id)); // why is this an object?

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Artist ID is required",
      },
    });
  }

  try {
    const supabase = await serverSupabaseClient(event);
    const data = await getArtistDetails(supabase, id);
    return data;
  } catch (error) {
    console.error("Error fetching artist details:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch artist details",
      },
    });
  }
});
