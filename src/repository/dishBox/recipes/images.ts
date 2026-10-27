import sql from "@/lib/db";

async function deleteRecipeImage(
  user_id: string,
  imgUrls: string[],
): Promise<string[]> {
  if (imgUrls.length === 0) return [];

  try {
    const rows = await sql<{ image_url: string }[]>`
      DELETE FROM dishBox.recipe_images
      WHERE image_url = ANY(${imgUrls}::text[])
        AND recipe_id IN (
          SELECT id FROM dishBox.recipes WHERE user_id = ${user_id}
        )
      RETURNING image_url
    `;

    return rows.map((row) => row.image_url);
  } catch (error) {
    console.error("DB: Failed to delete recipe images:", error);
    throw new Error("Failed to delete images from database", { cause: error });
  }
}

export { deleteRecipeImage };
