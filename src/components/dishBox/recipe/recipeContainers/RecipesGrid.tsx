import type { RecipeMetaDataResponse } from "@/types/recipe/recipe.schemas";
import s from "@/styles/components/recipes/recipeGrid.module.css";
import RecipesCard from "../recipesMetaData/RecipesMetaDataCard";

type Props = {
  title?: string;
  recipes: RecipeMetaDataResponse[];
  userId?: number;
};

export default function RecipesGrid({ title, recipes, userId }: Props) {
  return (
    <section className={s.recipesGrid}>
      {title && <h2>{title}</h2>}

      <div className={s.wrapper}>
        <div className={s.container}>
          {recipes.map((recipe) => (
            <div className={s.item} key={recipe.id}>
              <RecipesCard data={recipe} userId={userId} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
