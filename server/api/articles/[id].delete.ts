import { serverSupabaseClient } from "#supabase/server";
import { deleteArticle } from "@server/services/articles.service";

export default defineEventHandler(async (event) => {
  console.log("deleting article!");

  const user = await requireAdmin(event);
  const id = event.context.params?.id as string;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Missing article ID!",
      },
    });
  }

  try {
    const supabase = await serverSupabaseClient(event);
    await deleteArticle(supabase, id);
  } catch (err) {
    console.log("Error deleting article: " + err);
    throw new Error("Failed to delete content!");
  }
});
