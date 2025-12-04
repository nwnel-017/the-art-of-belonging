import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../../supabase.types";
import type { ArticleForm } from "./validations/form";

export async function createArticle(
  supabase: SupabaseClient<Database>,
  article: ArticleForm
) {
  const { data, error } = await supabase
    .from("articles")
    .insert(article)
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
