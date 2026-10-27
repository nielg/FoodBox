import s from "@/styles/components/recipes/recipeMetaData/FavoriteBtn.module.css";
import { Star } from "lucide-react";
import { useState } from "react";

type Props = {
  is_favorite: boolean;
  recipe_id: number;
  likes_count: number;
  userId?: number;
};

export default function FavoriteBtn({
  is_favorite,
  recipe_id,
  likes_count,
  userId,
}: Props) {
  const [isFavorite, setIsFavorite] = useState(is_favorite);
  const [likesCount, setLikesCount] = useState(likes_count);
  const [isLoading, setIsLoading] = useState(false);

  const addFavorite = async () => {
    const response = await fetch(`/api/recipe/${recipe_id}/favorite/add`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to add favorite");
    }
  };

  const removeFavorite = async () => {
    const response = await fetch(`/api/recipe/${recipe_id}/favorite/remove`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to remove favorite");
    }
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (isLoading) return;

    const prevFavorite = isFavorite;
    const prevLikes = likesCount;

    setIsFavorite(!prevFavorite);
    setLikesCount((count) => (prevFavorite ? count - 1 : count + 1));
    setIsLoading(true);

    try {
      if (prevFavorite) {
        await removeFavorite();
      } else {
        await addFavorite();
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
      // Revert state if the API request fails
      setIsFavorite(prevFavorite);
      setLikesCount(prevLikes);
    } finally {
      setIsLoading(false);
    }
  };

  if (userId === undefined) {
    return (
      <div
        className={s.likesBadge}
        role="img"
        aria-label={`${likesCount} likes`}
      >
        <Star className={s.favoriteIcon} aria-hidden="true" />
        <span>{likesCount}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`${s.favoriteButton} ${isFavorite ? s.favorite : ""}`}
      aria-label={`${isFavorite ? "Remove from favorites" : "Add to favorites"} (${likesCount} likes)`}
      aria-pressed={isFavorite}
      disabled={isLoading}
      onClick={handleClick}
      name="Like"
    >
      <Star
        className={s.favoriteIcon}
        fill={isFavorite ? "currentColor" : "none"}
        aria-hidden="true"
      />
      <span>{likesCount}</span>
    </button>
  );
}
