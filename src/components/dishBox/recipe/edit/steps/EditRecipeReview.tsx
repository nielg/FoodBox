import { useEditRecipe } from "../context/EditRecipeContext";
import s from "@/styles/components/editRecipe/editRecipe.module.css";
import EditRecipeTags from "../EditRecipeTags";

type Props = {
  tags: string[];
};

export default function EditRecipeReview({ tags }: Props) {
  const { submit, isValid, updateField, formData } = useEditRecipe();
  return (
    <div className={s.reviewContainer}>
      <span className={`${s.stepBadge} badge`}>Step 4</span>
      <h2 className={s.stepTitle}>Review &amp; Submit</h2>
      <p className={s.stepDescription}>
        Check the preview on the right. Once you're happy, submit your recipe!
      </p>
      <div>
        <input
          type="checkbox"
          id="public"
          name="public"
          checked={formData.public}
          onChange={(e) => updateField("public", e.target.checked)}
        />
        <label htmlFor="public">Make Public</label>
      </div>
      <EditRecipeTags tags={tags} />
      <button onClick={submit} className={s.submitBtn} disabled={!isValid()}>
        Submit Recipe →
      </button>
    </div>
  );
}
