import { requireAdmin } from "@server/utils/auth/requireAdmin";
import { serverSupabaseClient } from "#supabase/server";
import { updateArtist } from "@server/services/artists.service";

export default defineEventHandler(async (event) => {
  console.log("Received PATCH request for artist update");

  const user = await requireAdmin(event);

  try {
    const supabase = await serverSupabaseClient(event);
    const form = await readMultipartFormData(event);
    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: {
          message: "No form data provided",
        },
      });
    }
    const result = await updateArtist(supabase, form);
    return result;
  } catch (error) {
    console.error("Error updating artist:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to update artist",
      },
    });
  }
});
