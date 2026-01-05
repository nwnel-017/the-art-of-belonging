import { serverSupabaseClient } from "#supabase/server";
import { getArticleDetails } from "@server/services/articles.service";

export default defineEventHandler(async (event) => {
  const user = await requireAdmin(event);
  const id = event.context.params?.id as string;

  console.log("getting info for article: " + id); // passed incorrectly as an object

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request",
      data: {
        message: "Missing article id!",
      },
    });
  }

  try {
    const supabase = await serverSupabaseClient(event);
    const article = await getArticleDetails(supabase, id);
    console.log("retrieved article: " + article);
    return article;
  } catch (err) {
    console.log("failed to get article details: " + err);
    throw new Error("Failed to retreive article!");
  }
});
