export function useArtists() {
  // const getArtists = async () => {
  //   try {
  //     const response = await useFetch("/api/artists/artists");
  //     // const data = await response.json();
  //     return response.data.value;
  //   } catch (err) {
  //     console.log("Error retrieving artists: " + err);
  //     throw new Error("Failed to retrieve artists");
  //   }
  // };

  const addArtist = async (name: string, bio: string, image: File | null) => {
    // Validation
    if (!name || !bio || !image) {
      return {
        success: false,
        message: "Please enter all fields!",
      };
    }

    // Create FormData
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    formData.append("image", image);

    try {
      const response = await fetch("/api/artists/artist", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result?.message || "Failed to submit artist!",
        };
      }

      return {
        success: true,
        message: "Submitted artist successfully!",
        data: result,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "An error occurred! Please try again!",
      };
    }
  };

  return { addArtist };
}
