"use client";
import s from "@/styles/components/stockBox/inventoryTable.module.css";
import type { StockInventoryResponse } from "@/types/stock/stock.schema";
import InventoryActions from "./InventoryActions";
import { InventoryProvider, useInventory } from "./InventoryContext";

type Props = {
  inventory: StockInventoryResponse[];
};

export default function InventoryTable({ inventory }: Props) {
  return (
    <InventoryProvider initialInventory={inventory}>
      <InventoryTableContent />
    </InventoryProvider>
  );
}

function InventoryTableContent() {
  const { inventory } = useInventory();

  return (
    <section className={s.inventory}>
      <div className={s.tableWrapper}>
        <table className={s.table}>
          <thead className={s.tableHead}>
            <tr>
              <th className={s.heading} scope="col">
                Name
              </th>
              <th className={s.heading} scope="col">
                Metric
              </th>
              <th className={`${s.heading} ${s.quantityHeading}`} scope="col">
                Quantity
              </th>
              <th className={`${s.heading} ${s.actionsHeading}`} scope="col">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr className={s.row} key={item.item_id}>
                <td className={s.cell}>{item.name}</td>
                <td className={s.cell}>{item.metric}</td>
                <td className={`${s.cell} ${s.quantity}`}>{item.quantity}</td>
                <td className={`${s.cell} ${s.actionsCell}`}>
                  <InventoryActions item={item} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
