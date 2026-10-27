import sql from "@/lib/db";
import {
  StockItemResponseSchema,
  type StockBatchRequest,
  type StockItemRequest,
  type StockItemResponse,
} from "@/types/stock/stock.schema";
import { z } from "astro/zod";

export async function createStockItem(
  user_id: number,
  item: StockItemRequest,
): Promise<StockItemResponse> {
  let rows: unknown;
  try {
    rows = await sql`
      INSERT INTO stockbox.stock_items (user_id, name, metric)
      VALUES (${user_id}, ${item.name}, ${item.metric})
      RETURNING id, name, metric
    `;
  } catch (error) {
    console.error("DB: Failed to create stock item", error);
    throw new Error("Database insert failed", { cause: error });
  }

  const [createdItem] = z.array(StockItemResponseSchema).parse(rows);
  if (!createdItem) {
    throw new Error("Failed to create stock item");
  }

  return createdItem;
}

export async function addItemQuantity(
  user_id: number,
  item_id: number,
  quantity: number,
  expireDate: string,
): Promise<boolean> {
  try {
    return await sql.begin(async (transaction) => {
      // 1. Verify item exists and user has access
      const [item] = await transaction`
        SELECT id
        FROM stockbox.stock_items
        WHERE id = ${item_id}
          AND (public = true OR user_id = ${user_id})
        FOR UPDATE
      `;

      if (!item) {
        return false;
      }

      // 2. Insert new batch or update quantity if batch already exists for same user, item & date
      await transaction`
        INSERT INTO stockbox.stock_batches (
          user_id,
          stock_item_id,
          quantity,
          expire_date
        )
        VALUES (
          ${user_id},
          ${item_id},
          ${quantity},
          ${expireDate}::timestamptz
        )
        ON CONFLICT (user_id, stock_item_id, expire_date)
        DO UPDATE SET
          quantity = stockbox.stock_batches.quantity + EXCLUDED.quantity,
          updated_at = CURRENT_TIMESTAMP
      `;

      return true;
    });
  } catch (error) {
    console.error("DB: Failed to add stock item quantity", error);
    throw new Error("Database update failed", { cause: error });
  }
}

export async function removeItemQuantity(
  user_id: number,
  item_id: number,
  quantity: number,
  expireDate: string,
): Promise<boolean> {
  try {
    return await sql.begin(async (transaction) => {
      const [item] = await transaction`
        SELECT id
        FROM stockbox.stock_items
        WHERE id = ${item_id}
          AND (public = true OR user_id = ${user_id})
        FOR UPDATE
      `;

      if (!item) {
        return false;
      }

      const batches = await transaction`
        SELECT id, quantity::double precision AS quantity
        FROM stockbox.stock_batches
        WHERE stock_item_id = ${item_id}
          AND user_id = ${user_id}
          AND expire_date::date = ${expireDate}::date
        ORDER BY created_at, id
        FOR UPDATE
      `;

      let remaining = quantity;

      for (const batch of batches) {
        if (remaining <= 0) {
          break;
        }

        const batchQuantity = Number(batch.quantity);
        const quantityToRemove = Math.min(batchQuantity, remaining);

        if (quantityToRemove === batchQuantity) {
          await transaction`
            DELETE FROM stockbox.stock_batches
            WHERE id = ${batch.id}
          `;
        } else {
          await transaction`
            UPDATE stockbox.stock_batches
            SET quantity = quantity - ${quantityToRemove}
            WHERE id = ${batch.id}
          `;
        }

        remaining -= quantityToRemove;
      }

      if (remaining > 0.000001) {
        throw new RangeError(
          "Insufficient quantity for the selected expiration date",
        );
      }

      return true;
    });
  } catch (error) {
    if (error instanceof RangeError) {
      throw error;
    }

    console.error("DB: Failed to remove stock item quantity", error);
    throw new Error("Database update failed", { cause: error });
  }
}
