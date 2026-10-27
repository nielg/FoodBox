import s from "@/styles/components/editRecipe/editRecipe.module.css";
import t from "@/styles/components/tags/tag.module.css";
import { useEditRecipe } from "./context/EditRecipeContext";

type Props = {
  tags: string[];
};

export default function EditRecipeTags({ tags }: Props) {
  const { updateField, formData } = useEditRecipe();

  const availableTags = Array.from(new Set([...tags, ...formData.tags]));

  const toggleTag = (tag: string) => {
    const nextTags = formData.tags.includes(tag)
      ? formData.tags.filter((selectedTag) => selectedTag !== tag)
      : [...formData.tags, tag];

    updateField("tags", nextTags);
  };
  return (
    <section className={s.tagEditor} aria-labelledby="recipe-tags-heading">
      <h3 id="recipe-tags-heading" className={s.tagEditorTitle}>
        Recipe tags
      </h3>
      <p className={s.tagEditorDescription}>
        Select tags to add them. Select them again to remove them.
      </p>
      <div className={s.tagOptions}>
        {availableTags.map((tag) => {
          const selected = formData.tags.includes(tag);

          return (
            <button
              key={tag}
              type="button"
              className={`${t.tag} ${selected ? t.active : ""}`}
              aria-pressed={selected}
              onClick={() => toggleTag(tag)}
            >
              {selected ? "✓ " : "+ "}
              {tag}
            </button>
          );
        })}
        {availableTags.length === 0 && (
          <span className={s.noTagsMessage}>No tags are available yet.</span>
        )}
      </div>
    </section>
  );
}
