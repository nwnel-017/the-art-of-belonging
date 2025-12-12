import { getAllArtists } from "@server/services/artists.service";

export default defineEventHandler(async (event) => {
  console.log("Getting all artists!");

  try {
    const supabase = serverSupabaseClient(event);

    const data = await getAllArtists(supabase);

    return data;
  } catch (error) {
    console.error("Error fetching artists:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch artists",
      },
    });
  }
});
