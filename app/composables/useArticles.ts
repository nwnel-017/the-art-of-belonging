export function useArticles() {
  const addArticle = async (article: {
    title: string;
    body: string;
    author: string;
  }) => {
    // Validation
    if (
      !article.title.trim() ||
      !article.body.trim() ||
      !article.author.trim()
    ) {
      return {
        success: false,
        message: "All fields are required!",
      };
    }

    try {
      const { data, error } = await useFetch("/api/articles/article", {
        method: "POST",
        body: article,
      });

      if (error.value) {
        return {
          success: false,
          message: error.value?.message || "Failed to submit article!",
        };
      }

      return {
        success: true,
        message: "Article submitted successfully!",
        data: data.value,
      };
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: "An error occurred! Please try again!",
      };
    }
  };

  return { addArticle };
}
