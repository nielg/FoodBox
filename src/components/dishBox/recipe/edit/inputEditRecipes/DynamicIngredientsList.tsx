import { useState } from "react";
import DynamicInputList from "./DynamicInputList";
import DynamicInputItemSlot from "./DynamicInputItemSlot";
import styles from "@/styles/components/editRecipe/inputPreview.module.css";
import { useEditRecipe } from "../context/EditRecipeContext";

export function DynamicIngredientsList() {
  const { updateListItem, formData, addListItem, deleteListItem } =
    useEditRecipe();
  const [editingId, setEditingId] = useState<number | null>(
    formData.ingredients[0]?.id || null,
  );

  const addItem = () => {
    const newId = formData.ingredients.length;
    addListItem("ingredients", newId);
    setEditingId(newId);
  };

  return (
    <DynamicInputList
      type="ingredients"
      items={formData.ingredients}
      onAddItem={addItem}
    >
      {(item) => {
        const isEditing = editingId === item.id;
        const isEmpty = !item.value.trim();

        return (
          <DynamicInputItemSlot
            key={item.id}
            type="ingredients"
            isEditing={isEditing}
            canDelete={formData.ingredients.length > 1}
            onToggleEdit={() => setEditingId(isEditing ? null : item.id)}
            onDelete={() => deleteListItem("ingredients", item.id)}
            renderInput={
              <input
                type="text"
                className={styles["input-preview__field"]}
                value={item.value}
                placeholder="Ingredients here"
                autoFocus
                onChange={(e) =>
                  updateListItem("ingredients", item.id, e.target.value)
                }
              />
            }
            renderDisplay={
              <p
                className={`${styles["input-preview__text"]} ${isEmpty ? styles["is-empty"] : ""}`}
              >
                - {item.value}
              </p>
            }
          />
        );
      }}
    </DynamicInputList>
  );
}
