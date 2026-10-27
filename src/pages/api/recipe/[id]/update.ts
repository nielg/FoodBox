import authService from "@/service/authService";
import RecipesService from "@/service/dishBox/recipeService";
import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";

export const PUT: APIRoute = async ({ request, params, cookies }) => {
  const auth = await authService.getAuthenticatedUserId(cookies);
  if (!auth.success) {
    return auth.response;
  }

  const recipeId = Number(params.id);
  const body = await request.json();

  if (Number.isNaN(recipeId)) {
    const successPayload: ApiResponse = {
      success: false,
      message: "Invalid recipe ID",
    };

    return Response.json(successPayload, { status: 400 });
  }

  try {
    const recipe = await RecipesService.updateRecipe(recipeId, body);

    const successPayload: ApiResponse = {
      success: true,
      message: "Recipe updated successfully!",
      data: recipe,
    };

    return Response.json(successPayload, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update recipe";

    const errorPayload: ApiResponse = {
      success: false,
      message,
    };
    return Response.json(errorPayload, { status: 500 });
  }
};
