import { z } from "astro/zod";

export const StockItemResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  metric: z.string(),
});

export type StockItemResponse = z.infer<typeof StockItemResponseSchema>;

export const StockItemRequestSchema = z.object({
  name: z.string(),
  metric: z.string(),
});
export type StockItemRequest = z.infer<typeof StockItemRequestSchema>;

export const StockBatchRequestSchema = z.object({
  stock_id: z.number(),
  quantity: z.number().positive(),
  expireDate: z.coerce.date(),
});

export const StockRequestQuantitySchema = z.object({
  quantity: z.number().int().positive(),
});

const ExpireDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Expiration date must use YYYY-MM-DD format")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, "Expiration date must be a valid calendar date");

export const StockBatchQuantityRequestSchema = z.object({
  quantity: z
    .number()
    .finite()
    .positive()
    .refine(
      (quantity) => Math.round(quantity * 100) / 100 === quantity,
      "Quantity must have at most two decimal places",
    ),
  expireDate: ExpireDateSchema,
});

export const ItemBatchSchema = z.object({
  expireDate: z.coerce.date(),
  quantity: z.number(),
});

export const StockInventoryResponseSchema = z.object({
  item_id: z.number(),
  name: z.string(),
  metric: z.string(),
  quantity: z.number(),
  expireDates: z.array(ItemBatchSchema),
});

export type StockInventoryResponse = z.infer<
  typeof StockInventoryResponseSchema
>;

export type StockBatchRequest = z.infer<typeof StockBatchRequestSchema>;
