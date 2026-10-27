import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";
import recipeService from "@/service/dishBox/recipeService";
import { handleZodValidationError } from "@/service";
import authService from "@/service/authService";
import { CreateRecipeSchema } from "@/types/recipe/recipe.schemas";

export const POST: APIRoute = async ({
  request,
  cookies,
}): Promise<Response> => {
  try {
    const auth = await authService.getAuthenticatedUserId(cookies);
    if (!auth.success) {
      return auth.response;
    }

    const body = await request.json();
    const data = CreateRecipeSchema.safeParse(body);

    if (!data.success) {
      return handleZodValidationError(data.error);
    }

    const createdDataRecipe = await recipeService.createRecipe({
      ...data.data,
      user_id: auth.user_id,
    });

    const successPayload: ApiResponse = {
      success: true,
      message: "Recipe created successfully!",
      data: createdDataRecipe,
    };

    return Response.json(successPayload, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create recipe";

    const errorPayload: ApiResponse = {
      success: false,
      message,
    };
    return Response.json(errorPayload, { status: 500 });
  }
};
