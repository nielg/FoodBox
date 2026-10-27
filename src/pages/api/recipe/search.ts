import type { ApiResponse } from "@/types";
import type { APIRoute } from "astro";
import recipeService from "@/service/dishBox/recipeService";
import authService from "@/service/authService";
export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = await authService.getAuthenticatedUserId(cookies);
  if (!auth.success) {
    return auth.response;
  }
  const user_id = auth.user_id;
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get("query")?.trim() ?? "";
    const tags: string[] = url.searchParams
      .getAll("tags")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    const recipes = await recipeService.searchRecipesMetaData(
      query,
      tags,
      user_id,
    );
    const successPayload: ApiResponse<typeof recipes> = {
      success: true,
      message: "Success",
      data: recipes,
    };
    return Response.json(successPayload, { status: 200 });
  } catch (error) {
    console.error("API: Failed to search recipes:", error);
    const message =
      error instanceof Error ? error.message : "Failed to search recipes";
    const errorPayload: ApiResponse<null> = {
      success: false,
      message,
      data: null,
    };
    return Response.json(errorPayload, { status: 500 });
  }
};
