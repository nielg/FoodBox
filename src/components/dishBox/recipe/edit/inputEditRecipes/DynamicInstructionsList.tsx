"use client";

import { useState } from "react";
import DynamicInputList from "./DynamicInputList";
import DynamicInputItemSlot from "./DynamicInputItemSlot";
import styles from "@/styles/components/editRecipe/inputPreview.module.css";
import { useEditRecipe } from "../context/EditRecipeContext";

export function DynamicInstructionsList() {
  const { updateListItem, formData, addListItem, deleteListItem } =
    useEditRecipe();
  const [editingId, setEditingId] = useState<number | null>(
    formData.ingredients[0]?.id || null,
  );

  const addItem = () => {
    const newId = formData.instructions.length;
    addListItem("instructions", newId);
    setEditingId(newId);
  };

  return (
    <DynamicInputList
      type="instructions"
      items={formData.instructions}
      onAddItem={addItem}
    >
      {(item, index) => {
        const isEditing = editingId === item.id;
        const isEmpty = !item.value.trim();

        return (
          <DynamicInputItemSlot
            key={item.id}
            type="instructions"
            isEditing={isEditing}
            canDelete={formData.instructions.length > 1}
            onToggleEdit={() => setEditingId(isEditing ? null : item.id)}
            onDelete={() => deleteListItem("instructions", item.id)}
            renderInput={
              <textarea
                className={styles["input-preview__field"]}
                value={item.value}
                placeholder="Placeholder"
                autoFocus
                onChange={(e) =>
                  updateListItem("instructions", item.id, e.target.value)
                }
              />
            }
            renderDisplay={
              <p
                className={`${styles["input-preview__text"]} ${isEmpty ? styles["is-empty"] : ""}`}
              >
                {index + 1}. {item.value || "Placeholder"}
              </p>
            }
          />
        );
      }}
    </DynamicInputList>
  );
}
