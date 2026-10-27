import type { RecipeProgress } from "@/types/recipe/recipe.types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import styles from "@/styles/components/editRecipe/progressBtn.module.css";
import { Fragment } from "react";
import { useEditRecipe } from "./context/EditRecipeContext";

const STEPS: RecipeProgress[] = [
  "intro",
  "ingredients",
  "instructions",
  "images",
  "preview",
];

const STEP_LABELS: Record<RecipeProgress, string> = {
  intro: "Intro",
  ingredients: "Ingredients",
  instructions: "Instructions",
  images: "Images",
  preview: "Review",
};

export default function EditRecipeProgress() {
  const { handleNext, handlePrevious, currentIndex, progress, setProgress } =
    useEditRecipe();

  return (
    <div className={styles.container}>
      <button
        className={styles.btn}
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        aria-label="Previous step"
      >
        <ArrowLeft size={16} />
      </button>

      <div className={styles.separator} />

      {STEPS.map((step, index) => (
        <Fragment key={step}>
          <div className={styles.stepContainer}>
            <button
              className={`${styles.btn} ${progress === step ? styles.active : ""}`}
              onClick={() => setProgress(step)}
              aria-label={`Go to step ${index + 1}: ${STEP_LABELS[step]}`}
            >
              {index + 1}
            </button>
            <span
              style={{
                color:
                  progress === step
                    ? "var(--primary-700)"
                    : "var(--text-muted)",
              }}
            >
              {STEP_LABELS[step]}
            </span>
          </div>
          {index < STEPS.length - 1 && (
            <div key={`sep-${step}`} className={styles.separator} />
          )}
        </Fragment>
      ))}

      <div className={styles.separator} />

      <button
        className={styles.btn}
        onClick={handleNext}
        disabled={currentIndex === STEPS.length - 1}
        aria-label="Next step"
      >
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
