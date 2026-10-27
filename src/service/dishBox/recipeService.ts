import RecipesRepository from "@/repository/dishBox/recipesRepository";
import UserRepository from "@/repository/userRepository";
import type {
  CreateRecipeInput,
  RecipeMetaDataResponse,
  RecipeResponse,
} from "@/types/recipe/recipe.schemas";

async function getRecipesMetaDataByUserid(
  userId: number,
): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getRecipeMetadata({ userId });
}

async function searchRecipesMetaData(
  query: string,
  tags: string[],
  userId?: number,
): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getRecipeMetadata({
    query,
    userId,
    publicRecipes: true,
    tags,
  });
}

async function createRecipe(body: CreateRecipeInput): Promise<RecipeResponse> {
  const createdDataRecipe =
    await RecipesRepository.createRecipeWithImages(body);

  return createdDataRecipe;
}

async function updateRecipe(
  recipeId: number,
  body: CreateRecipeInput,
): Promise<RecipeResponse> {
  const updatedRecipe = await RecipesRepository.updateRecipe(recipeId, body);
  return updatedRecipe;
}

async function getPublickRecipesMetaData(
  userId?: number,
): Promise<RecipeMetaDataResponse[]> {
  return RecipesRepository.getRecipeMetadata({ publicRecipes: true, userId });
}

async function deleteRecipeImages(user_id: string, recipeImages: string[]) {
  return RecipesRepository.deleteRecipeImage(user_id, recipeImages);
}

async function getUserFavoriteRecipesMetaData(
  userId: number,
): Promise<RecipeMetaDataResponse[]> {
  const recipes_ids = await UserRepository.getAllUserFavoriteRecipesIds(userId);

  if (recipes_ids.length === 0) {
    return [];
  }
  return RecipesRepository.getRecipeMetadata({
    userId,
    recipes_ids,
    publicRecipes: true,
  });
}

async function getVeganRecipesMetaData(userId?: number) {
  return await RecipesRepository.getRecipeMetadata({
    userId,
    publicRecipes: true,
    query: "vegan",
  });
}

async function getRecipeById(recipeId: number) {
  return await RecipesRepository.getRecipeById(recipeId);
}

const RecipeService = {
  createRecipe,
  getRecipesMetaDataByUserid,
  getPublickRecipesMetaData,
  updateRecipe,
  deleteRecipeImages,
  getUserFavoriteRecipesMetaData,
  searchRecipesMetaData,
  getVeganRecipesMetaData,
  getRecipeById,
};

export default RecipeService;
