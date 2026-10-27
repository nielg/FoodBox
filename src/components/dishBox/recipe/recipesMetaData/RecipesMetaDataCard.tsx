"use client";

import type { RecipeMetaDataResponse } from "@/types/recipe/recipe.schemas";
import s from "@/styles/components/recipes/recipeMetaData/index.module.css";
import FavoriteBtn from "./FavoriteBtn";

type Props = {
  data: RecipeMetaDataResponse;
  userId?: number;
};

export default function RecipesCard({ data, userId }: Props) {
  const defaultImg = "/dishBox/images/public/default-img.png";
  return (
    <a href={`/dishBox/${data.id}`} className={s.cardLink}>
      <article className={s.card}>
        <div className={s.cardThumbnail}>
          <img
            className={s.cardImg}
            src={data.imgurl ?? defaultImg}
            width={280}
            height={160}
            alt={`${data.title} thumbnail`}
          />

          <FavoriteBtn
            recipe_id={data.id}
            is_favorite={data.is_favorite}
            likes_count={data.likes_count}
            userId={userId}
          />

          <div className={s.cardImgOverlay} />
        </div>

        <div className={s.cardBody}>
          <h3 className={s.cardTitle}>{data.title}</h3>

          {data.description && <p className={s.cardDesc}>{data.description}</p>}

          <div className={s.cardFooter}>
            <span className={s.viewLink}>
              View recipe
              <span className={s.arrowIcon}>→</span>
            </span>
          </div>
        </div>
      </article>
    </a>
  );
}
