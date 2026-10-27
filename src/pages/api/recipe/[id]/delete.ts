import RecipesRepository from "@/repository/dishBox/recipesRepository";
import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";

export const DELETE: APIRoute = async ({ params }): Promise<Response> => {
  try {
    const recipeId = Number(params.id);

    if (!recipeId) {
      const errorPayload: ApiResponse = {
        success: false,
        message: "Recipe ID required",
      };
      return Response.json(errorPayload, { status: 400 });
    }

    const deletedRecipe = await RecipesRepository.deleteRecipeById(recipeId);

    const successPayload: ApiResponse = {
      success: true,
      message: `Succesfully deleted recipe ${deletedRecipe}`,
    };
    return Response.json(successPayload, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete recipe";
    const errorPayload: ApiResponse<null> = {
      success: false,
      message,
    };

    return Response.json(errorPayload, { status: 500 });
  }
};
