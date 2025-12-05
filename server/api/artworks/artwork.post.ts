// To Do: write server side logic
export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event);

  if (!form) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      data: {
        message: "No form data received",
      },
    });
  }

  return { success: true, message: "Artwork added successfully!" };
});
