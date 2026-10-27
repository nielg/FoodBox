import sql from "@/lib/db";
import {
  RecipeResponseSchema,
  type RecipeResponse,
  type CreateRecipeInput,
} from "@/types/recipe/recipe.schemas";
import { IMG_STORAGE_TYPE } from "astro:env/client";
import type postgres from "postgres";

async function replaceRecipeTags(
  tx: postgres.TransactionSql,
  recipeId: number,
  tags: string[],
): Promise<void> {
  await tx`DELETE FROM dishBox.recipe_tags WHERE recipe_id = ${recipeId}`;

  if (tags.length === 0) return;

  const insertedTags = await tx<{ tag_id: number }[]>`
    INSERT INTO dishBox.recipe_tags (recipe_id, tag_id)
    SELECT ${recipeId}, tags.id
    FROM dishBox.tags
    WHERE tags.value = ANY(${tags}::text[])
    ON CONFLICT (recipe_id, tag_id) DO NOTHING
    RETURNING tag_id
  `;

  if (insertedTags.length !== new Set(tags).size) {
    throw new Error("One or more recipe tags are not recognized");
  }
}

async function createRecipeWithImages(
  recipe: CreateRecipeInput,
): Promise<RecipeResponse> {
  return sql.begin(async (tx) => {
    const [createdRecipe] = await tx<RecipeResponse[]>`
      INSERT INTO dishBox.recipes (
        title,
        description,
        portions,
        ingredients,
        instructions,
        user_id,
        public
      )
      VALUES (
        ${recipe.title},
        ${recipe.description},
        ${recipe.portions},
        ${sql.json(recipe.ingredients)},
        ${sql.json(recipe.instructions)},
        ${recipe.user_id},
        ${recipe.public}
      )
      RETURNING id, user_id, title, description, portions, ingredients, instructions, public
    `;

    if (!createdRecipe) {
      throw new Error("Failed to create recipe");
    }

    await replaceRecipeTags(tx, createdRecipe.id, recipe.tags ?? []);

    if (recipe.imgurls && recipe.imgurls.length > 0) {
      await Promise.all(
        recipe.imgurls.map(
          (imageUrl) => tx`
            INSERT INTO dishBox.recipe_images (recipe_id, image_url, img_storage_type)
            VALUES (${createdRecipe.id}, ${imageUrl}, ${IMG_STORAGE_TYPE})
          `,
        ),
      );
    }

    return RecipeResponseSchema.parse({
      ...createdRecipe,
      tags: recipe.tags ?? [],
    });
  });
}

async function updateRecipe(
  id: number,
  recipe: Partial<CreateRecipeInput>,
): Promise<RecipeResponse> {
  try {
    const updated = await sql.begin(async (tx) => {
      const [row] = await tx`
        UPDATE dishBox.recipes
        SET
          title = COALESCE(${recipe.title ?? null}, title),
          description = COALESCE(${recipe.description ?? null}, description),
          portions = COALESCE(${recipe.portions ?? null}, portions),
          public = COALESCE(${recipe.public ?? null}, public),
          ingredients = COALESCE(
            ${recipe.ingredients !== undefined ? tx.json(recipe.ingredients) : null},
            recipes.ingredients
          ),
          instructions = COALESCE(
            ${recipe.instructions !== undefined ? tx.json(recipe.instructions) : null},
            recipes.instructions
          )
        WHERE id = ${id}
        RETURNING id, user_id, title, description, portions, ingredients, instructions, public
      `;

      if (!row) {
        throw new Error(`Recipe with ID ${id} not found`);
      }

      if (recipe.tags !== undefined) {
        await replaceRecipeTags(tx, id, recipe.tags);
      }

      if (recipe.imgurls && recipe.imgurls.length > 0) {
        await tx`
          INSERT INTO dishBox.recipe_images ${tx(
            recipe.imgurls.map((image_url) => ({
              recipe_id: id,
              image_url,
              img_storage_type: IMG_STORAGE_TYPE,
            })),
          )}
          ON CONFLICT (recipe_id, image_url) DO NOTHING
        `;
      }

      const [tagRow] = await tx<{ tags: string[] }[]>`
        SELECT COALESCE(
          ARRAY(
            SELECT tags.value
            FROM dishBox.recipe_tags
            JOIN dishBox.tags ON tags.id = recipe_tags.tag_id
            WHERE recipe_tags.recipe_id = ${id}
            ORDER BY tags.value
          ),
          '{}'
        ) AS tags
      `;

      return { ...row, tags: tagRow?.tags ?? [] };
    });

    return RecipeResponseSchema.parse(updated);
  } catch (error) {
    console.error(`DB: Failed to update recipe with ID ${id}:`, error);
    throw new Error(`Database update failed for recipe with ID ${id}`, {
      cause: error,
    });
  }
}

async function deleteRecipeById(id: number): Promise<string> {
  let deletedCount: number;
  try {
    const result = await sql`
      DELETE FROM dishBox.recipes
      WHERE id = ${id}
    `;
    deletedCount = result.count;
  } catch (error) {
    console.error("DB: Failed to delete recipe:", error);
    throw new Error("Database delete failed", { cause: error });
  }

  if (deletedCount === 0) {
    throw new Error(`Recipe with ID ${id} not found`);
  }

  return `Succesfully delete recipe ${id}`;
}

export { createRecipeWithImages, deleteRecipeById, updateRecipe };
