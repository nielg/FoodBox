import { useEditRecipe } from "./context/EditRecipeContext";
import s from "@/styles/components/editRecipe/uploadImg.module.css";

type Props = {
  objectURLS: string[];
  onDeleteImage: (index: number) => void;
};

export function RecipeImg({ objectURLS, onDeleteImage }: Props) {
  return (
    <div className={s.imgContainer}>
      {objectURLS.map((url, index) => (
        <div key={url} className={s.imageWrapper}>
          <img
            src={url}
            alt={`Preview ${index + 1}`}
            className={s.previewImage}
            onClick={() => onDeleteImage(index)}
            title="Click to remove"
          />
        </div>
      ))}
    </div>
  );
}
