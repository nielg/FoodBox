import sql from "@/lib/db";
import {
  StockInventoryResponseSchema,
  StockItemResponseSchema,
  type StockInventoryResponse,
  type StockItemResponse,
} from "@/types/stock/stock.schema";
import { z } from "astro/zod";

export async function getStockItems(
  user_id: number,
): Promise<StockItemResponse[]> {
  let rows: unknown;
  try {
    rows = await sql`
      SELECT id, name, metric
      FROM stockbox.stock_items
      WHERE public = true OR user_id = ${user_id}
      ORDER BY name, id
    `;
  } catch (error) {
    console.error("DB: Failed to fetch stock items", error);
    throw new Error("Database fetch failed", { cause: error });
  }

  return z.array(StockItemResponseSchema).parse(rows);
}

export async function getStockInventory(
  user_id: number,
): Promise<StockInventoryResponse[]> {
  let rows: unknown;
  try {
    rows = await sql`
      SELECT
        item.id AS item_id,
        item.name,
        item.metric,
        COALESCE(SUM(batch.quantity), 0)::double precision AS quantity,
        COALESCE(
          json_agg(
            json_build_object(
              'expireDate', batch.expire_date,
              'quantity', batch.quantity::double precision
            )
          ) FILTER (WHERE batch.id IS NOT NULL),
          '[]'::json
        ) AS "expireDates"
      FROM stockbox.stock_items item
      LEFT JOIN stockbox.stock_batches batch
        ON batch.stock_item_id = item.id
        AND batch.user_id = ${user_id}
      WHERE item.public = true OR item.user_id = ${user_id}
      GROUP BY item.id, item.name, item.metric
      ORDER BY item.name, item.id
    `;
  } catch (error) {
    console.error("DB: Failed to fetch inventory", error);
    throw new Error("Database fetch failed", { cause: error });
  }

  return z.array(StockInventoryResponseSchema).parse(rows);
}
