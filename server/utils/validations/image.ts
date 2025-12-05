export async function validateImageFile(file: File) {
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSizeInBytes = 5 * 1024 * 1024; // 5MB

  if (!file) {
    throw new Error("No file provided.");
  }
  if (!validImageTypes.includes(file.type)) {
    throw new Error(
      "Invalid image type. Allowed types are JPEG, PNG, GIF, and WEBP."
    );
  }
  if (file.size > maxSizeInBytes) {
    throw new Error("Image size exceeds the maximum limit of 5MB.");
  }
  return true;
}
