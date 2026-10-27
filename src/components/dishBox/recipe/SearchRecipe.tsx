"use client";

import { useEffect, useState } from "react";
import s from "@/styles/components/recipes/searchRecipe.module.css";
import type { RecipeMetaDataResponse } from "@/types/recipe/recipe.schemas";
import RecipesGrid from "./recipeContainers/RecipesGrid";
import { X } from "lucide-react";
import TagCarrousel from "../tags/TagCarrousel";

type Props = {
  initialRecipes: RecipeMetaDataResponse[];
  tags: string[];
  userId?: number;
};

export default function SearchRecipe({ initialRecipes, tags, userId }: Props) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [recipes, setRecipes] =
    useState<RecipeMetaDataResponse[]>(initialRecipes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim() && activeTags.length === 0) {
      setRecipes(initialRecipes);
      return;
    }

    // Wait 300ms after the user stops typing
    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (query.trim()) {
          params.set("query", query.trim());
        }

        if (activeTags.length > 0) {
          activeTags.forEach((tag) => params.append("tags", tag));
        }
        const response = await fetch(`/api/recipe/search?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        setRecipes(data.data);
      } catch (error) {
        console.error("Search failed:", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    // Cancel the previous timeout if the user types again
    return () => clearTimeout(timeout);
  }, [query, activeTags]);

  const clearSearch = () => {
    setQuery("");
    setActiveTags([]);
  };

  return (
    <section className={s.searchRecipe}>
      <div className={s.searchInputContainer}>
        <div className={s.searchInputWrapper}>
          <input
            name="query"
            className={s.searchInput}
            type="text"
            placeholder="Search recipes by title or tag"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {(Boolean(query) || activeTags.length > 0) && (
            <button
              type="button"
              className={s.clearIcon}
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className={s.statusContainer}>
          {loading && <p className={s.status}>Searching...</p>}

          {!loading && query && recipes.length === 0 && (
            <p className={s.status}>No recipes found.</p>
          )}
          <TagCarrousel
            tags={tags}
            activeTags={activeTags}
            setActiveTags={setActiveTags}
          />
        </div>
      </div>

      <RecipesGrid recipes={recipes} userId={userId} />
    </section>
  );
}
