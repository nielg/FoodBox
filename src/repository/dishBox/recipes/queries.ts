import sql from "@/lib/db";
import {
  RecipeMetaDataResponseSchema,
  type RecipeMetaDataResponse,
  RecipeResponseSchema,
  type RecipeResponse,
} from "@/types/recipe/recipe.schemas";
import { z } from "astro/zod";
import { IMG_STORAGE_TYPE } from "astro:env/client";
import type postgres from "postgres";

interface getRecipeMetadataArgs {
  userId?: number;
  query?: string;
  publicRecipes?: boolean;
  recipes_ids?: number[];
  tags?: string[];
}

async function getRecipeMetadata({
  userId,
  query,
  publicRecipes,
  recipes_ids,
  tags,
}: getRecipeMetadataArgs): Promise<RecipeMetaDataResponse[]> {
  const resultLimit = query !== undefined ? sql`LIMIT 20` : sql``;

  const whereConditions = [];

  if (publicRecipes || !userId) {
    // Public recipes
    whereConditions.push(sql`recipes.public = true`);
  } else {
    // Recipes from user_id
    whereConditions.push(sql`recipes.user_id = ${userId}`);
  }

  // Only recipes in recipes_ids
  if (recipes_ids && recipes_ids.length > 0) {
    whereConditions.push(
      sql`recipes.id = ANY(${sql.array(recipes_ids)}::integer[])`,
    );
  }

  // Search query
  if (query && query.trim()) {
    whereConditions.push(sql`
      (
        recipes.title ILIKE ${`%${query.trim()}%`}
        OR recipes.description ILIKE ${`%${query.trim()}%`}
      )
    `);
  }

  // Tag query
  if (tags && tags.length > 0) {
    whereConditions.push(sql`
      recipes.id IN (
        SELECT recipe_tags.recipe_id
        FROM dishBox.recipe_tags
        JOIN dishBox.tags ON tags.id = recipe_tags.tag_id
        WHERE tags.value = ANY(${tags})
        GROUP BY recipe_tags.recipe_id
        HAVING COUNT(DISTINCT tags.value) = ${tags.length}
      )
    `);
  }

  // Combine conditions with AND
  const whereClause =
    whereConditions.length > 0
      ? sql`WHERE ${whereConditions.reduce((acc, cond) => sql`${acc} AND ${cond}`)}`
      : sql``;

  let rows: unknown;

  try {
    rows = await sql`
        SELECT DISTINCT ON (recipes.id)
          recipes.id,
          recipes.user_id,
          recipes.title,
          recipes.description,
          recipes.portions,
          recipes.public,
          recipes.likes_count,
          COALESCE(
            ARRAY(
              SELECT tags.value
              FROM dishBox.recipe_tags
              JOIN dishBox.tags ON tags.id = recipe_tags.tag_id
              WHERE recipe_tags.recipe_id = recipes.id
              ORDER BY tags.value
            ),
            '{}'
          ) AS tags,
          recipe_images.image_url AS imgurl,
          user_recipes_favorite.user_id IS NOT NULL AS is_favorite
        FROM dishBox.recipes
        LEFT JOIN dishBox.recipe_images
          ON recipes.id = recipe_images.recipe_id
        LEFT JOIN dishBox.user_recipes_favorite
          ON recipes.id = user_recipes_favorite.recipe_id
          AND user_recipes_favorite.user_id = ${userId ?? null}
        ${whereClause}
        ORDER BY recipes.id, recipe_images.created_at DESC
        ${resultLimit}
      `;
  } catch (error) {
    console.error("DB: Failed to fetch recipe metadata:", error);
    throw new Error("Database fetch failed", { cause: error });
  }

  return z.array(RecipeMetaDataResponseSchema).parse(rows);
}

async function getRecipeById(id: number): Promise<RecipeResponse | undefined> {
  let rows: postgres.Row[];
  try {
    rows = await sql`
        SELECT recipes.id,
          recipes.user_id,
          recipes.title,
          recipes.description,
          recipes.portions,
          recipes.ingredients,
          recipes.instructions,
          recipes.public,
          recipes.likes_count,
          COALESCE(
            ARRAY(
              SELECT tags.value
              FROM dishBox.recipe_tags
              JOIN dishBox.tags ON tags.id = recipe_tags.tag_id
              WHERE recipe_tags.recipe_id = recipes.id
              ORDER BY tags.value
            ),
            '{}'
          ) AS tags,
          COALESCE(
            ARRAY_AGG(recipe_images.image_url ORDER BY recipe_images.id)
              FILTER (WHERE recipe_images.image_url IS NOT NULL),
            '{}'
          ) AS imgurls
        FROM dishBox.recipes
        LEFT JOIN dishBox.recipe_images
          ON recipes.id = recipe_images.recipe_id
          AND recipe_images.img_storage_type = ${IMG_STORAGE_TYPE}
        WHERE recipes.id = ${id}
        GROUP BY recipes.id
      `;
  } catch (error) {
    console.error("DB: Failed to fetch recipe:", error);
    throw new Error("Database fetch failed", { cause: error });
  }

  const [row] = rows ?? [];

  if (!row) {
    return;
  }

  return RecipeResponseSchema.parse(row);
}

export { getRecipeById, getRecipeMetadata };
