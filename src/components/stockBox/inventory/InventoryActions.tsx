"use client";
import s from "@/styles/components/stockBox/inventoryTable.module.css";
import EditItemQuantity from "@/components/modals/EditItemQuantity";
import type { StockInventoryResponse } from "@/types/stock/stock.schema";

type Props = {
  item: StockInventoryResponse;
};

export default function InventoryAction({ item }: Props) {
  return (
    <div className={s.actions}>
      <EditItemQuantity action="add" item={item} />
      <EditItemQuantity action="remove" item={item} />
      <EditItemQuantity action="request" item={item} />
    </div>
  );
}
