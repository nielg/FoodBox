import Carrousel from "@/components/dishBox/Carrousel";
import styles from "@/styles/components/recipe.module.css";
import { ShoppingBasket, ChefHat } from "lucide-react";
import type { RecipeWithoutId } from "@/types/recipe/recipe.types";

interface RecipeProp {
  recipe: RecipeWithoutId;
}

export default function Recipe({ recipe }: RecipeProp) {
  return (
    <div className={styles.recipePage}>
      {/* Hero header */}
      <header className={styles.recipeHero}>
        <h1 className={styles.recipeTitle}>{recipe.title}</h1>

        <p className={styles.recipeDescription}>{recipe.description}</p>

        <div className={styles.recipeMeta}>
          <span className={styles.badge}>
            {recipe.portions} {recipe.portions === 1 ? "portion" : "portions"}
          </span>

          <span className={styles.badge}>
            {recipe.ingredients.length} ingredients
          </span>

          <span className={styles.badge}>
            {recipe.instructions.length} steps
          </span>

          {recipe.public && <span className={styles.badge}>Public</span>}
          {recipe.tags.map((tag) => (
            <span className={styles.badge} key={`${tag}-badge`}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className={styles.sectionDivider} />

      {/* Two-column content */}
      <div className={styles.recipeBody}>
        {/* Ingredients */}
        <section
          className={`${styles.recipeSection} ${styles.ingredientsSection}`}
        >
          <div className={styles.sectionHeading}>
            <div className={styles.sectionIconWrap}>
              <ShoppingBasket size={20} />
            </div>

            <h2>Ingredients</h2>
          </div>

          <ul className={styles.ingredientsList}>
            {recipe.ingredients.map((item, index) => (
              <li className={styles.ingredientItem} key={`${item}-${index}`}>
                <span className={styles.ingredientDot} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Instructions */}
        <section
          className={`${styles.recipeSection} ${styles.instructionsSection}`}
        >
          <div className={styles.sectionHeading}>
            <div className={styles.sectionIconWrap}>
              <ChefHat size={20} />
            </div>

            <h2>Instructions</h2>
          </div>

          <ol className={styles.instructionsList}>
            {recipe.instructions.map((step, index) => (
              <li className={styles.instructionStep} key={`${step}-${index}`}>
                <span className={styles.stepNumber}>{index + 1}</span>

                <p className={styles.stepText}>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {recipe.imgurls && recipe.imgurls.length > 0 && (
        <Carrousel items={recipe.imgurls} />
      )}
    </div>
  );
}
