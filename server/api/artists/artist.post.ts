import { addArtist } from "@server/services/artists.service";

export default defineEventHandler(async (event) => {
  console.log("Hit backend");

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
    const supabase = serverSupabaseClient(event);
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
