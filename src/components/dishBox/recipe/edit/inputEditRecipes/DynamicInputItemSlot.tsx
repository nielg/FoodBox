"use client";

import { Pencil, Check, Trash2 } from "lucide-react";
import styles from "@/styles/components/editRecipe/inputPreview.module.css";

type DynamicInputItemSlotProps = {
  type: "ingredients" | "instructions";
  isEditing: boolean;
  canDelete: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
  renderInput: React.ReactNode;
  renderDisplay: React.ReactNode;
};

export default function DynamicInputItemSlot({
  type,
  isEditing,
  canDelete,
  onToggleEdit,
  onDelete,
  renderInput,
  renderDisplay,
}: DynamicInputItemSlotProps) {
  const variantClass = styles[`input-preview--${type}`] || "";

  return (
    <div className={`${styles["input-preview"]} ${variantClass}`}>
      <div className={styles["input-preview__container"]}>
        <div className={styles["input-preview__content-wrapper"]}>
          {isEditing ? renderInput : renderDisplay}
        </div>

        <div className={styles["input-preview__actions"]}>
          <button
            type="button"
            className={styles["input-preview__btn"]}
            onClick={onToggleEdit}
            title={isEditing ? "Save" : "Edit"}
          >
            {isEditing ? (
              <Check className={styles["input-preview__icon"]} />
            ) : (
              <Pencil className={styles["input-preview__icon"]} />
            )}
          </button>

          {canDelete && (
            <button
              type="button"
              className={`${styles["input-preview__btn"]} ${styles["input-preview__btn--danger"]}`}
              onClick={onDelete}
              title="Delete"
            >
              <Trash2 className={styles["input-preview__icon"]} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
