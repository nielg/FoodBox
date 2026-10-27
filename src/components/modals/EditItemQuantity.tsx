"use client";

import styles from "@/styles/modal.module.css";
import s from "@/styles/components/stockBox/inventoryTable.module.css";
import { type StockInventoryResponse } from "@/types/stock/stock.schema";
import { useState } from "react";
import { Plus, Minus, Send } from "lucide-react";
import {
  getInventoryQuantityForDate,
  useInventory,
} from "@/components/stockBox/inventory/InventoryContext";

type Props = {
  action: "add" | "remove" | "request";
  item: StockInventoryResponse;
};

const actionText = {
  add: "Add",
  remove: "Remove",
  request: "Request",
};

export default function EditItemQuantity({ action, item }: Props) {
  const { updateItemQuantity } = useInventory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  // Store date as ISO string (YYYY-MM-DD) for HTML inputs
  const todayStr = new Date().toISOString().split("T")[0];
  const [expireDate, setExpireDate] = useState<string>(todayStr);
  const maxRemoveQuantity = getInventoryQuantityForDate(item, expireDate);

  const handleOpen = () => {
    setIsOpen(true);
    // If removing, default the select dropdown to the first available expiration date
    if (action === "remove" && item.expireDates.length > 0) {
      const firstDate = new Date(item.expireDates[0].expireDate)
        .toISOString()
        .split("T")[0];
      setExpireDate(firstDate);
    } else {
      setExpireDate(todayStr);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setErrorMsg(null);
    setQuantity(0);
    setExpireDate(todayStr);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (quantity <= 0) {
      setErrorMsg("Please enter a valid quantity greater than 0.");
      return;
    }

    if (action !== "request" && !expireDate) {
      setErrorMsg("Please select or enter an expiration date.");
      return;
    }

    setErrorMsg(null);

    try {
      setIsSubmitting(true);

      const response = await fetch(
        `/api/stockBox/item/${item.item_id}/quantity/${action}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expireDate: action !== "request" ? expireDate : null,
            quantity,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      if (action !== "request") {
        updateItemQuantity(item.item_id, action, quantity, expireDate);
      }

      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Failed to change quantity. Please try again.");
      }
      console.error("Failed to change quantity:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        className={`${s.actionButton} ${s[action]}`}
        type="button"
        aria-label={`${actionText[action]} item`}
        title={`${actionText[action]} item`}
        onClick={handleOpen}
      >
        {action === "add" && <Plus size={16} />}
        {action === "remove" && <Minus size={16} />}
        {action === "request" && <Send size={16} />}
      </button>

      {/* Modal Overlay & Dialog */}
      {isOpen && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.title}>{actionText[action]} item batch</h2>
              <button
                type="button"
                className={styles.closeIconButton}
                onClick={handleClose}
              >
                &times;
              </button>
            </div>

            {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <h2>
                {item.name} {item.metric ? `in ${item.metric}` : ""}
              </h2>

              <div className={styles.fieldGroup}>
                <label htmlFor="quantity" className={styles.label}>
                  Quantity
                </label>
                <input
                  id="quantity"
                  type="number"
                  name="quantity"
                  min="0.01"
                  max={action === "remove" ? maxRemoveQuantity : undefined}
                  step="0.01"
                  placeholder="e.g. 10"
                  className={styles.input}
                  value={quantity || ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (
                      action === "remove" &&
                      maxRemoveQuantity > 0 &&
                      val > maxRemoveQuantity
                    ) {
                      setQuantity(maxRemoveQuantity);
                    } else {
                      setQuantity(val);
                    }
                  }}
                  required
                />
              </div>

              {action !== "request" && (
                <div className={styles.fieldGroup}>
                  <label htmlFor="expireDate" className={styles.label}>
                    Expiration Date
                  </label>

                  {action === "add" ? (
                    <input
                      id="expireDate"
                      type="date"
                      name="expireDate"
                      className={styles.input}
                      value={expireDate}
                      onChange={(e) => setExpireDate(e.target.value)}
                      required
                    />
                  ) : (
                    <select
                      id="expireDate"
                      name="expireDate"
                      className={styles.input}
                      value={expireDate}
                      onChange={(e) => setExpireDate(e.target.value)}
                      required
                    >
                      {item.expireDates.length === 0 ? (
                        <option value="" disabled>
                          No expiration dates available
                        </option>
                      ) : (
                        item.expireDates.map((exp, idx) => {
                          const dateString = new Date(exp.expireDate)
                            .toISOString()
                            .split("T")[0];
                          return (
                            <option key={idx} value={dateString}>
                              {dateString}
                            </option>
                          );
                        })
                      )}
                    </select>
                  )}
                </div>
              )}

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={handleClose}
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
