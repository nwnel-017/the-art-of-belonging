import { addArtwork } from "@server/services/artworks.service";
import { validateArtworkForm } from "@utils/validation/form";

export default defineEventHandler(async (event) => {
  console.log("Adding new artwork via API");
  const form = await readMultipartFormData(event); // MultiPartData[]

  // passed
  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "No form data received",
      },
    });
  }

    const validatedForm = await validateArtworkForm(form); // expects object
  if (!validatedForm.success) {
    // invalid form
    console.log("Invalid form!");
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Invalid form!",
        details: validatedForm.error.format(),
      },
    });
  }

  try {
    const supabase = serverSupabaseClient(event);
    await addArtwork(supabase, validatedForm.data);
  } catch (err) {
    console.log("error adding artwork: " + err);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create artwork!",
      data: {
        err,
      },
    });
  }

  return { success: true, message: "Artwork added successfully!" };
});
