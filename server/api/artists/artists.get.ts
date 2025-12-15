import { getAllArtists } from "@server/services/artists.service";
import { serverSupabaseClient } from "#supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "#types/supabase/database";

export default defineEventHandler(async (event) => {
  console.log("Getting all artists!");

  try {
    const supabase = (await serverSupabaseClient(
      event
    )) as SupabaseClient<Database>;

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
