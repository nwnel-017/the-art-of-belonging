import { getArtworks } from "@server/services/artworks.service";

export default defineEventHandler(async (event) => {
  console.log("retrieving artworks!");

  try {
    const supabase = serverSupabaseClient(event);
    const data = await getArtworks(supabase);
    console.log("got artworks from backend!", data); // Added data to log
    return data;
  } catch (err) {
    console.log("Error fetching artworks: " + err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch artworks",
      },
    });
  }
});
