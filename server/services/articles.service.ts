import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "#types/supabase/database";
import type { MultiPartData } from "h3";
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

export async function getArticleDetails(
  supabase: SupabaseClient<Database>,
  articleId: string
) {
  if (!articleId || !supabase) {
    throw new Error("Missing parameters!");
  }

  // articleId was sent as an object
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", articleId)
    .single();

  if (error || !data) {
    console.error("Error retrieving article: " + error?.message);
    throw new Error("Failed to retrieve article!");
  }

  return data;
}

export async function updateArticle(
  supabase: SupabaseClient<Database>,
  form: MultiPartData[]
) {
  console.log("Updating article");

  if (!form) throw new Error("Missing form!");

  const articleId =
    form.find((field) => field.name === "id")?.data.toString() || "";
  const articleTitle = form
    .find((field) => field?.name === "title")
    ?.data.toString();
  const articleBody =
    form.find((field) => field?.name === "body")?.data.toString() || "";
  const articleAuthor =
    form.find((field) => field?.name === "author")?.data.toString() || "";

  if (
    !articleId.trim() ||
    !articleTitle?.trim() ||
    !articleBody.trim() ||
    !articleAuthor.trim()
  ) {
    console.log("Missing fields in form");
    throw new Error("Missing required fields in form!");
  }

  // check to make sure article already exists
  const { data, error } = await supabase
    .from("articles")
    .select("id")
    .eq("id", articleId)
    .single();

  if (error || !data) {
    console.log("article is not existing in supabase");
    throw new Error("Failed to retrieve existing article!");
  }

  const { error: updateError } = await supabase
    .from("articles")
    .update({
      title: articleTitle.trim(),
      body: articleBody.trim(),
      author: articleAuthor.trim(),
    })
    .eq("id", articleId);

  if (updateError) {
    console.log(
      "Failed to update article in supabase: " + updateError?.message
    );
    throw new Error("Failed to update content!");
  }
}
