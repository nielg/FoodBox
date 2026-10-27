"use client";

import React, { useState } from "react";
import { z } from "zod";
import styles from "@/styles/modal.module.css";
import {
  StockItemRequestSchema,
  type StockItemRequest,
} from "@/types/stock/stock.schema";

export default function CreateStockItemModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    try {
      const validatedData: StockItemRequest =
        StockItemRequestSchema.parse(rawData);

      setIsSubmitting(true);

      const response = await fetch(`/api/stockBox/item/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      e.currentTarget.reset();
      setIsOpen(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMsg(error.message || "Invalid form data");
      } else if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Failed to submit item. Please try again.");
      }
      console.error("Failed to submit Item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        className={styles.openButton}
        onClick={() => setIsOpen(true)}
      >
        Create Stock Item
      </button>

      {/* Modal Overlay & Dialog */}
      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>Add Stock Item</h2>
              <button
                type="button"
                className={styles.closeIconButton}
                onClick={() => setIsOpen(false)}
              >
                &times;
              </button>
            </div>

            {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.fieldGroup}>
                <label htmlFor="name" className={styles.label}>
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Milk"
                  className={styles.input}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="metric" className={styles.label}>
                  Metric
                </label>
                <input
                  id="metric"
                  type="text"
                  name="metric"
                  placeholder="e.g. Liters, milliliters"
                  className={styles.input}
                />
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
