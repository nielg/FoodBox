"use client";

import { Plus } from "lucide-react";
import styles from "@/styles/components/editRecipe/inputPreview.module.css";

type DynamicInputListProps<T> = {
  type: "ingredients" | "instructions";
  items: T[];
  onAddItem: () => void;
  children: (item: T, index: number) => React.ReactNode;
};

export default function DynamicInputList<T>({
  type,
  items,
  onAddItem,
  children,
}: DynamicInputListProps<T>) {
  return (
    <div
      className={`${styles["dynamic-list"]} ${styles[`dynamic-list--${type}`] || ""}`}
    >
      <div className={styles["dynamic-list__items"]}>
        {items.map((item, index) => children(item, index))}
      </div>

      <button type="button" className={styles.addBtn} onClick={onAddItem}>
        <Plus className={styles.icon} />
        Add {type === "ingredients" ? "Ingredient" : "Instruction"}
      </button>
    </div>
  );
}
