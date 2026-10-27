import EditRecipeProgressBtn from "./EditRecipeProgress";
import s from "@/styles/components/editRecipe/editRecipe.module.css";
import Recipe from "../Recipe";
import type { RecipeResponse } from "@/types/recipe/recipe.schemas";
import { useEffect } from "react";
import { useEditRecipe, EditRecipeProvider } from "./context/EditRecipeContext";
import EditRecipeIngredients from "./steps/EditRecipeIngredients";
import EditRecipeInstructions from "./steps/EditRecipeInstructions";
import EditRecipeIntro from "./steps/EditRecipeIntro";
import EditRecipeReview from "./steps/EditRecipeReview";
import EditRecipeImg from "./steps/EditRecipeImg";

type Props = {
  inputRecipe?: RecipeResponse;
  tags: string[];
};

function FormContent({ inputRecipe, tags }: Props) {
  const { progress, formData, loadFormData } = useEditRecipe();

  useEffect(() => {
    if (inputRecipe) {
      loadFormData(inputRecipe);
    }
  }, [inputRecipe]);

  const recipe = {
    title: formData.title,
    description: formData.description,
    portions: formData.portions,
    ingredients: formData.ingredients.map((item) => item.value),
    instructions: formData.instructions.map((item) => item.value),
    tags: formData.tags,
    public: formData.public,
    imgurls: formData.imgurls.map((item) => item.value),
    user_id: 0,
    likes_count: 0,
  };

  return (
    <div className="container">
      <div
        className={`${s.inputPreviewContainer} ${progress === "preview" ? s.previewMode : ""}`}
      >
        <div className="forum">
          {progress === "intro" && <EditRecipeIntro />}
          {progress === "ingredients" && <EditRecipeIngredients />}
          {progress === "instructions" && <EditRecipeInstructions />}
          {progress === "images" && <EditRecipeImg />}
          {progress === "preview" && <EditRecipeReview tags={tags} />}
        </div>
        <Recipe recipe={recipe} />
      </div>
      <EditRecipeProgressBtn />
    </div>
  );
}

export default function EditRecipeForm({ inputRecipe, tags }: Props) {
  return (
    <EditRecipeProvider>
      <FormContent inputRecipe={inputRecipe} tags={tags} />
    </EditRecipeProvider>
  );
}
