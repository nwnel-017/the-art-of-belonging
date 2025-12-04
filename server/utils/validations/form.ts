import { z } from "zod";

export const articleFormSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    body: z.string().min(1, { message: "Body is required" }),
    author: z.string().min(1, { message: "Author is required" }),
  })
  .strict()
  .strip();

export type ArticleForm = z.infer<typeof articleFormSchema>;

export const validateArticleForm = (form: ArticleForm) => {
  return articleFormSchema.safeParse(form);
};
