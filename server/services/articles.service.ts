import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "#types/supabase/database";
import { validateArticleForm, type ArticleForm } from "@utils/validation/form";

export async function createArticle(
  supabase: SupabaseClient<Database>,
  article: ArticleForm
) {
  const parsed = validateArticleForm(article);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "Invalid article payload",
        details: parsed.error.format(),
      },
    });
  }

  const { data, error } = await supabase
    .from("articles")
    .insert(parsed.data)
    .select()
    .single();
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to create article",
        details: error.message,
      },
    });
  }
  return data;
}

export async function getArticles(supabase: SupabaseClient<Database>) {
  const { data, error } = await supabase.from("articles").select("*");
  if (error || !data) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch articles",
      },
    });
  }
  return data;
}
