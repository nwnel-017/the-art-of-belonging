import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";
import type { MultiPartData } from "h3";
import { isValid } from "zod/v3";
import { uploadFile, deleteFile } from "./storage.service";

// To Do - use validateImage instead of validating here

export async function addArtist(
  supabase: SupabaseClient<Database>,
  form: MultiPartData[]
) {
  console.log("reached addArtist in utils!");

  // Extract fields from multipart form data
  const name =
    form.find((field) => field.name === "name")?.data?.toString() || "";
  const bio =
    form.find((field) => field.name === "bio")?.data?.toString() || "";
  const imageField = form.find((field) => field.name === "image");

  if (!name.trim() || !bio.trim()) {
    throw new Error("Name and bio are required!");
  }
  if (!imageField || !imageField.filename) {
    throw new Error("Image is required!");
  }

  // Convert to File object
  const imageBuffer = new Uint8Array(imageField.data);
  const image = new File([imageBuffer], imageField.filename, {
    type: imageField.type,
  });

  try {
    const imagePath = await uploadFile(supabase, image, "artist_photos");
    console.log("image uploaded with public url:", imagePath.path);
    console.log("image uploaded with path:", imagePath.path);
    const { error } = await supabase.from("artists").insert({
      name: name.trim(),
      bio: bio.trim(),
      image_path: imagePath.path,
    });

    if (error) {
      console.log("Error inserting artist:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Error",
        data: {
          message: "Failed to add artist",
          details: error.message,
        },
      });
    }
  } catch (err) {
    console.log(err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to upload photo",
      },
    });
  }
}

export async function getAllArtists(supabase: SupabaseClient<Database>) {
  console.log("retrieving artists!");

  const { data: artists, error } = await supabase
    .from("artists")
    .select("id, name, bio, image_path")
    .order("name", { ascending: true });

  if (error || !artists) {
    console.error("Error fetching artists:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch artists",
        details: error.message,
      },
    });
  }

  artists.map((artist) => {
    const imagePath = artist.image_path;
    if (imagePath) {
      const { data: publicData } = supabase.storage
        .from("artist_photos")
        .getPublicUrl(imagePath);
      artist.image_path = publicData?.publicUrl || null;
    }
  });

  return artists ?? [];
}

export async function getArtistDetails(
  supabase: SupabaseClient<Database>,
  artistId: string
) {
  console.log("retrieving artist details for ID:", artistId); // coming in as image path????
  if (!artistId) {
    throw new Error("Artist ID is required.");
  }

  if (!supabase) {
    throw new Error("Supabase client is required.");
  }

  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("id", artistId)
    .single();

  if (error || !data) {
    console.error("Error fetching artist details:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch artist details",
        details: error.message,
      },
    });
  }

  const imagePath = data.image_path;
  const { data: publicData } = await supabase.storage
    .from("artist_photos")
    .getPublicUrl(imagePath || "");

  const publicUrl = publicData?.publicUrl || null;

  console.log("Artist details retrieved:", data);

  return { ...data, image_path: publicUrl };
}

export async function updateArtist(
  supabase: SupabaseClient<Database>,
  form: MultiPartData[]
) {
  console.log("reached updateArtist in utils!");

  // Extract fields from multipart form data
  const id = form.find((field) => field.name === "id")?.data?.toString() || "";
  const name =
    form.find((field) => field.name === "name")?.data?.toString() || "";
  const bio =
    form.find((field) => field.name === "bio")?.data?.toString() || "";
  const imageField = form.find((field) => field.name === "image");

  if (!id.trim() || !name.trim() || !bio.trim()) {
    throw new Error("ID, name, and bio are required!");
  }

  if (!imageField || !imageField.filename) {
    throw new Error("Image is required!");
  }

  // Convert to File object
  const imageBuffer = new Uint8Array(imageField.data);
  const image = new File([imageBuffer], imageField.filename, {
    type: imageField.type,
  });

  // to do - use artist id to find image path
  // delete old image from storage - using delete file function
  // upload new image
  const { data, error } = await supabase
    .from("artists")
    .select("image_path")
    .eq("id", id)
    .single();
  if (error || !data) {
    console.error("Error fetching existing artist data:", error);
    throw new Error("Failed to fetch existing artist data");
  }
  const existingImagePath = data.image_path;
  if (!existingImagePath) {
    throw new Error("No existing image path found for artist");
  }

  try {
    await deleteFile(supabase, existingImagePath, "artist_photos");
    const imagePath = await uploadFile(supabase, image, "artist_photos");
    console.log("image uploaded with public url:", imagePath.publicUrl);
    await supabase
      .from("artists")
      .update({
        name: name.trim(),
        bio: bio.trim(),
        image_path: imagePath.path,
      })
      .eq("id", id);
  } catch (err) {
    console.log("failed to update artist:", err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to update artist",
      },
    });
  }
}

// export async function uploadImage(
//   supabase: SupabaseClient<Database>,
//   image: File
// ) {
//   console.log("Uploading image into storage!");
//   if (!validateImageFile(image)) {
//     throw new Error("Invalid image file.");
//   }

//   const bucket = "artist_photos";
//   const ext = (image.name && image.name.split(".").pop()) || "png";
//   const fileName = `${Date.now()}_${Math.random()
//     .toString(36)
//     .slice(2, 8)}.${ext}`;

//   // Convert File -> Uint8Array for Supabase storage
//   const arrayBuffer = await image.arrayBuffer();
//   const fileBuffer = new Uint8Array(arrayBuffer);

//   const { data, error } = await supabase.storage
//     .from(bucket)
//     .upload(fileName, fileBuffer, {
//       contentType: image.type,
//       upsert: false,
//     });

//   if (error) {
//     console.error("Supabase storage upload error:", error);
//     throw error;
//   }

//   // Get public URL
//   const { data: publicData } = supabase.storage
//     .from(bucket)
//     .getPublicUrl(fileName);

//   return {
//     path: data?.path ?? fileName,
//     publicUrl: publicData?.publicUrl ?? null,
//   };
// }
