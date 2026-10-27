import InputPreview from "@/components/dishBox/recipe/edit/inputEditRecipes/InputPreview";
import "@/styles/global.css";
import s from "@/styles/components/editRecipe/editRecipe.module.css";
import { useEditRecipe } from "../context/EditRecipeContext";
import AddRecipeImg from "../AddRecipeImg";

export default function EditRecipeImg() {
  const { formData, updateField } = useEditRecipe();

  return (
    <>
      <div className={s.stepHeader}>
        <span className={`${s.stepBadge} badge`}>Step 4</span>
        <h2 className={s.stepTitle}>Images</h2>
        <p className={s.stepDescription}>Give your recipe few images.</p>
      </div>
      <AddRecipeImg />
    </>
  );
}
