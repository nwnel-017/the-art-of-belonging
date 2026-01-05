import { serverSupabaseClient } from "#supabase/server";
import { updateArticle } from "@server/services/articles.service";

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event);

  try {
    const supabase = await serverSupabaseClient(event);
    const form = await readMultipartFormData(event);
    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad Request",
        data: {
          message: "Missing form data",
        },
      });
    }
    const result = await updateArticle(supabase, form);
    return result;
  } catch (err) {
    console.log("Error updating article: " + err);
    throw new Error("Failed to update article");
  }
});
