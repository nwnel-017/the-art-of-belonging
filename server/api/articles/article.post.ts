import { createArticle } from "@server/services/articles.service";
import { validateArticleForm } from "~~/utils/validation/form";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) {
    console.log("No form provided");
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "No form provided",
      },
    });
  }

  const validatedForm = validateArticleForm(body);
  if (!validatedForm.success) {
    console.log("Invalid form!");
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Invalid form!",
      },
    });
  }

  try {
    const supabase = serverSupabaseClient(event);
    const article = await createArticle(supabase, validatedForm.data);
    console.log(article);
    return article;
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to create article",
      },
    });
  }
});
