import { requireAdmin } from "@server/utils/auth/requireAdmin";
import { deleteArtist } from "@server/services/artists.service";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event);
  const id = event.context.params?.id as string;

  try {
    const supabase = await serverSupabaseClient(event);
    await deleteArtist(supabase, id);
  } catch (error) {
    console.log("Error deleting artist: " + error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Error deleting artist",
      },
    });
  }
});
