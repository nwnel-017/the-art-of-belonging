import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "#types/supabase/database";
import { MultiPartData } from "h3";
import { validateArtworkForm, type ArtworkForm } from "@utils/validation/form";
import { validateImageFile } from "@utils/validation/image";
import { uploadFile } from "./storage.service";

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

    const imageUrl =
      typeof path === "string" ? path : path.publicUrl ?? path.path;

    const { data, error } = await supabase.from("artworks").insert({
      title: artwork.title,
      description: artwork.description,
      artist: artwork.artist || null,
      image_url: imageUrl,
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
  const { data, error } = await supabase
    .from("artworks")
    .select("id, title, description, artist, image_url");

  if (error || !data) {
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Error",
      data: {
        message: "Failed to fetch artworks",
        details: error?.message,
      },
    });
  }
  return data;
}

export { addArtwork, getArtworkCount, getArtworks };
