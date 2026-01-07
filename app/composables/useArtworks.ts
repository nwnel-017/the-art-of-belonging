export function useArtworks() {
  const addArtwork = async (
    title: string,
    description: string,
    image: File | null,
    artist: string,
    publishDate: string
  ) => {
    // Validation
    if (!title || !description || !image || !artist || !publishDate) {
      return {
        success: false,
        message: "Please enter all fields!",
      };
    }

    console.log("artist value being sent to backend:", artist);
    // Create FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("artist", artist?.toString());
    formData.append("publishDate", publishDate);
    formData.append("image", image);

    try {
      console.log("Submitting artwork...");
      const response = await fetch("/api/artworks/artwork", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result?.message || "Failed to submit artwork!",
        };
      }

      return {
        success: true,
        message: "Submitted artwork successfully!",
        data: result,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred! Please try again!",
      };
    }
  };

  return { addArtwork };
}
