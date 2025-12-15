import { addArtist } from "@server/services/artists.service";
import { serverSupabaseClient } from "#supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "#types/supabase/database";
import { requireAdmin } from "@server/utils/auth/requireAdmin";

export default defineEventHandler(async (event) => {
  console.log("Hit backend");

  const adminUser = await requireAdmin(event);

  const form = await readMultipartFormData(event);
  console.log("form received: " + form);

  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "No form data received",
      },
    });
  }

  try {
    const supabase = (await serverSupabaseClient(
      event
    )) as SupabaseClient<Database>;
    await addArtist(supabase, form);
  } catch (error) {
    console.error("Error adding artist:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to add artist",
      },
    });
  }

  return { success: true, message: "Artist added successfully!" };
});
