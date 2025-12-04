import { getArticles } from "../../utils/articles";

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseClient(event);
  const data = await getArticles(supabase);
  if (!data) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch articles",
      },
    });
  }
  return data;
});
