"use client";

import { DynamicIngredientsList } from "@/components/dishBox/recipe/edit/inputEditRecipes/DynamicIngredientsList";
import s from "@/styles/components/editRecipe/editRecipe.module.css";
import { useEditRecipe } from "../context/EditRecipeContext";

export default function EditRecipeIngredients() {
  const { formData, updateField } = useEditRecipe();
  return (
    <>
      <div className={s.stepHeader}>
        <span className={`${s.stepBadge} badge`}>Step 2</span>
        <h2 className={s.stepTitle}>Ingredients</h2>
        <p className={s.stepDescription}>
          Add all the ingredients needed for your recipe.
        </p>
      </div>

      <div className={s.portionsInputContainer}>
        <label htmlFor="portions" className={s.portionsLabel}>
          Portions
        </label>
        <input
          id="portions"
          type="number"
          min="1"
          value={formData.portions}
          onChange={(e) => {
            updateField("portions", Number(e.target.value));
          }}
          className={s.portionsInput}
        />
      </div>

      <DynamicIngredientsList />
    </>
  );
}
