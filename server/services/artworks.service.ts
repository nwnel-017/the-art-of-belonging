import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";
import { MultiPartData } from "h3";
import { validateArtworkForm, type ArtworkForm } from "@utils/validation/form";
import { validateImageFile } from "@utils/validation/image";
import { uploadFile, deleteFile } from "./storage.service";

// To Do:
// add form validation
async function addArtwork(
  supabase: SupabaseClient<Database>,
  artwork: ArtworkForm
) {
  console.log("Adding new artwork");

  if (!artwork) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "No artwork received!",
      },
    });
  }
  // validate image
  const image: File | null = artwork.image;

  try {
    validateImageFile(image);
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Invalid artwork!",
      },
    });
  }

  try {
    const path = await uploadFile(supabase, image, "artwork_images");

    const imageUrl = typeof path === "string" ? path : path.path ?? "";

    const { data, error } = await supabase.from("artworks").insert({
      title: artwork.title,
      description: artwork.description,
      artist: artwork.artist || null,
      image_path: imageUrl,
      publish_on: artwork.publishDate, // supabase generated types use string instead of Date
    });

    if (error) {
      console.error("Error inserting artwork into database:", error); // error is null?
      throw createError({
        statusCode: 500,
        statusMessage: "Internal Error",
        data: {
          message: "Failed to add artwork to database!",
          details: error?.message || "Unknown error",
        },
      });
    }
    return data;
  } catch (err) {
    console.log("Error: " + err);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to upload artwork!",
      },
    });
  }
}

async function updateArtwork(
  supabase: SupabaseClient<Database>,
  artwork: MultiPartData[]
) {
  if (!artwork) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "No artwork received!",
      },
    });
  }

  const id =
    artwork.find((field) => field.name === "id")?.data?.toString() || "";

  const title =
    artwork.find((field) => field.name === "title")?.data?.toString() || "";

  const description =
    artwork.find((field) => field.name === "description")?.data?.toString() ||
    "";

  const imageField = artwork.find((field) => field.name === "image");

  const publishOn =
    artwork.find((field) => field.name === "publishDate")?.data?.toString() ||
    "";

  if (!id.trim() || !title.trim() || !description.trim() || !publishOn.trim()) {
    console.log("id: " + id); // missing id
    console.log("title: " + title);
    console.log("description: " + description);
    console.log("image field: " + imageField);
    throw new Error("Form is missing required fields!");
  }

  if (!imageField || !imageField.filename) {
    throw new Error("Image is required!");
  }
  // To do - move to utils function
  // Convert to File object
  const imageBuffer = new Uint8Array(imageField.data);
  const image = new File([imageBuffer], imageField.filename, {
    type: imageField.type,
  });

  // to do - use artist id to find image path
  // delete old image from storage - using delete file function
  // upload new image
  // to do - check if image actually needs to be updated first
  const { data, error } = await supabase
    .from("artworks")
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
    await deleteFile(supabase, existingImagePath, "artwork_images");
    const imagePath = await uploadFile(supabase, image, "artwork_images");
    console.log("image uploaded with public url:", imagePath.publicUrl);
    console.log("new published date: " + publishOn); // why is this the same date?
    await supabase
      .from("artworks")
      .update({
        title: title.trim(),
        description: description.trim(),
        image_path: imagePath.path,
        publish_on: publishOn.trim(),
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

async function deleteArtwork(supabase: SupabaseClient<Database>, id: string) {
  console.log("deleting artwork...");

  if (!supabase || !id) {
    throw new Error("Missing parameters!");
  }

  // look up artist for image_path
  const { data: artwork, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", id)
    .single();

  console.log("row retrieved: " + artwork);
  console.log("image path: " + artwork?.image_path); // undefined

  if (error || !artwork || !artwork.image_path) {
    throw new Error("Failed to retrieve artwork!");
  }

  try {
    await deleteFile(supabase, artwork.image_path, "artwork_images");
  } catch (err) {
    console.log("Failed to delete artist: " + err);
    throw new Error("Failed to delete artist");
  }

  // delete artist from artists table
  const { error: deleteError } = await supabase
    .from("artworks")
    .delete()
    .eq("id", id);
  if (deleteError) {
    console.log("failed to delete artwork: " + deleteError);
    throw new Error("Failed to delete artwork!");
  }
}

async function getArtworkDetails(
  supabase: SupabaseClient<Database>,
  id: string
) {
  console.log("getting artwork details!");

  if (!supabase || !id) {
    throw new Error("Missing parameters!");
  }

  const { data, error } = await supabase
    .from("artworks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.log("failed to retrieve artwork details: " + JSON.stringify(error));
    throw new Error("Failed to retrieve artwork from supabase!");
  }

  const imagePath = data?.image_path;

  const { data: publicData } = await supabase.storage
    .from("artwork_images")
    .getPublicUrl(imagePath || "");

  const publicUrl = publicData?.publicUrl || null;

  return { ...data, image_path: publicUrl };
}

async function getArtworkCount(supabase: SupabaseClient<Database>) {
  const { count: artworkCount, error: artError } = await supabase
    .from("artworks")
    .select("id", { count: "exact", head: true });

  if (artError) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch total artwork count",
        details: artError.message,
      },
    });
  }

  return artworkCount || 0;
}

async function getArtworks(supabase: SupabaseClient<Database>) {
  const { data: artworks, error } = await supabase.from("artworks").select("*");

  if (error || !artworks) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch artworks",
        details: error?.message,
      },
    });
  }

  artworks.map((artwork) => {
    const imagePath = artwork.image_path;
    if (imagePath) {
      const { data: publicData } = supabase.storage
        .from("artwork_images")
        .getPublicUrl(imagePath);
      artwork.image_path = publicData?.publicUrl;
    }
  });

  return artworks;
}

async function getCurrentArtworks(supabase: SupabaseClient<Database>) {
  const { data: artworks, error } = await supabase
    .from("artworks")
    .select("*")
    .lte("publish_on", new Date().toISOString().slice(0, 10));

  if (error || !artworks) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch artworks",
        details: error?.message,
      },
    });
  }

  artworks.map((artwork) => {
    const imagePath = artwork.image_path;
    if (imagePath) {
      const { data: publicData } = supabase.storage
        .from("artwork_images")
        .getPublicUrl(imagePath);
      artwork.image_path = publicData?.publicUrl;
    }
  });

  return artworks;
}

async function getUpcomingArtworks(supabase: SupabaseClient<Database>) {
  if (!supabase) throw new Error("Missing supabase client!");
  const { data: artworks, error } = await supabase
    .from("artworks")
    .select("*")
    .gt("publish_on", new Date().toISOString().slice(0, 10));

  if (error || !artworks) {
    console.log(
      "error retrieving upcoming gallery from supabase: " + error?.message
    );
    throw new Error("Failed to retrieve upcoming gallery!");
  }

  artworks.map((artwork) => {
    const imagePath = artwork.image_path;
    if (imagePath) {
      const { data: publicData } = supabase.storage
        .from("artwork_images")
        .getPublicUrl(imagePath);
      artwork.image_path = publicData?.publicUrl;
    }
  });

  return artworks;
}

export {
  addArtwork,
  getArtworkDetails,
  updateArtwork,
  deleteArtwork,
  getArtworkCount,
  getArtworks,
  getUpcomingArtworks,
  getCurrentArtworks,
};
