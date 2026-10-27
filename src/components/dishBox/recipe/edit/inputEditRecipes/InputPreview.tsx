"use client";

import { useState } from "react";
import { Pencil, Check } from "lucide-react";
import styles from "@/styles/components/editRecipe/inputPreview.module.css";

type Props = {
  name?: string;
  placeHolder?: string;
  info?: string;
  type: "h1" | "textarea";
  rows?: number;
  value: string;
  setValue: (value: string) => void;
};

export default function InputPreview({
  name,
  placeHolder = "",
  info,
  type,
  rows,
  value,
  setValue,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const handleToggle = () => setIsEditing((prev) => !prev);

  const isEmpty = !value.trim();
  const displayValue = value || placeHolder;

  // Compute standard modified variants safely via module strings
  const previewVariantClass = styles[`input-preview--${type}`] || "";

  return (
    <div className={`${styles["input-preview"]} ${previewVariantClass}`}>
      <div className={styles["input-preview__container"]}>
        <div className={styles["input-preview__content-wrapper"]}>
          {isEditing ? (
            type === "textarea" ? (
              <textarea
                id={name}
                name={name}
                className={styles["input-preview__field"]}
                value={value}
                placeholder={placeHolder}
                rows={rows}
                autoFocus
                onChange={(e) => setValue(e.target.value)}
              />
            ) : (
              <input
                id={name}
                name={name}
                type="text"
                className={styles["input-preview__field"]}
                value={value}
                placeholder={placeHolder}
                autoFocus
                onChange={(e) => setValue(e.target.value)}
              />
            )
          ) : (
            <div className={styles["input-preview__display"]}>
              {type === "h1" ? (
                <h1
                  className={`${styles["input-preview__text"]} ${isEmpty ? styles["is-empty"] : ""}`}
                >
                  {displayValue}
                </h1>
              ) : (
                <p
                  className={`${styles["input-preview__text"]} ${isEmpty ? styles["is-empty"] : ""}`}
                >
                  {displayValue}
                </p>
              )}
              {/* Ensure value is still submitted when not in edit mode */}
              <input type="hidden" name={name} value={value} />
            </div>
          )}
        </div>

        <div className={styles["input-preview__actions"]}>
          <button
            type="button"
            className={styles["input-preview__btn"]}
            onClick={handleToggle}
            title={isEditing ? "Save" : "Edit"}
          >
            {isEditing ? (
              <Check className={styles["input-preview__icon"]} />
            ) : (
              <Pencil className={styles["input-preview__icon"]} />
            )}
          </button>
        </div>
      </div>
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
