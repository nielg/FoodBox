import InputPreview from "@/components/dishBox/recipe/edit/inputEditRecipes/InputPreview";
import "@/styles/global.css";
import s from "@/styles/components/editRecipe/editRecipe.module.css";
import { useEditRecipe } from "../context/EditRecipeContext";

export default function EditRecipeIntro() {
  const { formData, updateField } = useEditRecipe();

  return (
    <>
      <div className={s.stepHeader}>
        <span className={`${s.stepBadge} badge`}>Step 1</span>
        <h2 className={s.stepTitle}>Introduction</h2>
        <p className={s.stepDescription}>
          Give your recipe a title and a short description.
        </p>
      </div>
      <form>
        <InputPreview
          name="title"
          placeHolder="Recipe title"
          type="h1"
          value={formData.title}
          setValue={(val) => updateField("title", val)}
        />
        <InputPreview
          name="description"
          placeHolder="Describe your recipe…"
          type="textarea"
          rows={5}
          value={formData.description}
          setValue={(val) => updateField("description", val)}
        />
      </form>
    </>
  );
}
