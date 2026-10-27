import s from "@/styles/components/tags/TagCarrousel.module.css";
import t from "@/styles/components/tags/tag.module.css";

type Props = {
  tags: string[];
  activeTags: string[];
  setActiveTags: React.Dispatch<React.SetStateAction<string[]>>;
  maxWidth?: string;
};

export default function TagCarrousel({
  tags,
  activeTags,
  setActiveTags,
  maxWidth = "100%",
}: Props) {
  const handleTagClick = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <section className={s.tagContainer} style={{ maxWidth }}>
      {tags.map((tag) => {
        const isActive = activeTags.includes(tag);

        return (
          <button
            type="button"
            key={tag}
            className={`${t.tag} ${isActive ? t.active : ""}`}
            onClick={() => handleTagClick(tag)}
            aria-pressed={isActive}
          >
            {tag}
          </button>
        );
      })}
    </section>
  );
}
