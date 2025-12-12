import { z } from "zod";
import type { MultiPartData } from "h3";
import { validateImageFile } from "./image";

// To Do: organize a little better
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

const FileType = typeof File !== "undefined" ? File : Object;

export const artworkFormSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    artist: z.string().optional(),
    image: z.custom<File>((v) => v instanceof FileType),
  })
  .strict()
  .strip();

export type ArtworkForm = z.infer<typeof artworkFormSchema>;

export const validateArtworkForm = async (form: MultiPartData[]) => {
  console.log("safe parsing artwork form...");

  // Extract fields from multipart array into object
  const title =
    form.find((field) => field.name === "title")?.data?.toString() || "";
  const description =
    form.find((field) => field.name === "description")?.data?.toString() || "";
  const artist =
    form.find((field) => field.name === "artist")?.data?.toString() || "";
  const imageField = form.find((field) => field.name === "image");

  // Convert to File object
  const image = imageField
    ? new File(
        [new Uint8Array(imageField.data)],
        imageField.filename || "image",
        { type: imageField.type }
      )
    : new File([], "");

  const formData: ArtworkForm = { title, description, artist, image };
  const parsed = artworkFormSchema.safeParse(formData);

  if (!parsed.success) {
    console.log("Artwork form validation failed:", parsed.error);
    return parsed;
  }

  try {
    validateImageFile(parsed.data.image);
  } catch (error) {
    console.log("Image validation failed:", error);
    const zodError = new z.ZodError([
      {
        code: z.ZodIssueCode.custom,
        path: ["image"],
        message:
          error instanceof Error ? error.message : "Failed to validate image!",
      },
    ]);
    return {
      success: false as const,
      error: zodError,
    };
  }

  return parsed;
};
