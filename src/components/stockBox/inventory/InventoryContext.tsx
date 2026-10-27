import { createContext, useContext, useState, type ReactNode } from "react";
import type { StockInventoryResponse } from "@/types/stock/stock.schema";

type QuantityAction = "add" | "remove";

type InventoryContextValue = {
  inventory: StockInventoryResponse[];
  updateItemQuantity: (
    itemId: number,
    action: QuantityAction,
    quantity: number,
    expireDate: string,
  ) => void;
};

const InventoryContext = createContext<InventoryContextValue | undefined>(
  undefined,
);

function dateKey(date: Date | string): string {
  if (typeof date === "string") {
    return date.slice(0, 10);
  }

  return date.toISOString().slice(0, 10);
}

export function InventoryProvider({
  initialInventory,
  children,
}: {
  initialInventory: StockInventoryResponse[];
  children: ReactNode;
}) {
  const [inventory, setInventory] = useState(initialInventory);

  const updateItemQuantity: InventoryContextValue["updateItemQuantity"] = (
    itemId,
    action,
    quantity,
    expireDate,
  ) => {
    setInventory((currentInventory) =>
      currentInventory.map((item) => {
        if (item.item_id !== itemId) {
          return item;
        }

        let expireDates = [...item.expireDates];

        if (action === "add") {
          const matchingBatch = expireDates.find(
            (batch) => dateKey(batch.expireDate) === expireDate,
          );

          if (matchingBatch) {
            expireDates = expireDates.map((batch) =>
              batch === matchingBatch
                ? { ...batch, quantity: batch.quantity + quantity }
                : batch,
            );
          } else {
            expireDates.push({
              expireDate: new Date(`${expireDate}T00:00:00.000Z`),
              quantity,
            });
          }
        } else {
          let remaining = quantity;

          expireDates = expireDates.flatMap((batch) => {
            if (dateKey(batch.expireDate) !== expireDate || remaining <= 0) {
              return [batch];
            }

            const removed = Math.min(batch.quantity, remaining);
            remaining -= removed;
            const newQuantity = batch.quantity - removed;

            return newQuantity > 0 ? [{ ...batch, quantity: newQuantity }] : [];
          });
        }

        return {
          ...item,
          expireDates,
          quantity:
            Math.round(
              expireDates.reduce((total, batch) => total + batch.quantity, 0) *
                100,
            ) / 100,
        };
      }),
    );
  };

  return (
    <InventoryContext.Provider value={{ inventory, updateItemQuantity }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}

export function getInventoryQuantityForDate(
  item: StockInventoryResponse,
  expireDate: string,
): number {
  return item.expireDates.reduce(
    (total, batch) =>
      dateKey(batch.expireDate) === expireDate ? total + batch.quantity : total,
    0,
  );
}
