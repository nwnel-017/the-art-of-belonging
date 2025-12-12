import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";

async function uploadFile(
  supabase: SupabaseClient<Database>,
  file: File,
  bucket: string
) {
  console.log("uploading file!");
  // RLS error here

  if (!supabase || !file || !bucket) {
    throw createError({
      statusCode: 500,
      statusMessage: "Missing parameters",
    });
  }

  const ext = (file.name && file.name.split(".").pop()) || "png";
  const fileName = file.name;

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = new Uint8Array(arrayBuffer);

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    throw error;
  }

  // Get public URL
  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return {
    path: data?.path ?? fileName,
    publicUrl: publicData?.publicUrl ?? null,
  };
}

export { uploadFile };
