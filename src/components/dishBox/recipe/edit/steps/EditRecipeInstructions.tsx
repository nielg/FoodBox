import { DynamicInstructionsList } from "@/components/dishBox/recipe/edit/inputEditRecipes/DynamicInstructionsList";
import s from "@/styles/components/editRecipe/editRecipe.module.css";

export default function EditRecipeInstructions() {
  return (
    <>
      <div className={s.stepHeader}>
        <span className={`${s.stepBadge} badge`}>Step 3</span>
        <h2 className={s.stepTitle}>Instructions</h2>
        <p className={s.stepDescription}>
          Describe each step to prepare the recipe.
        </p>
      </div>
      <DynamicInstructionsList />
    </>
  );
}
