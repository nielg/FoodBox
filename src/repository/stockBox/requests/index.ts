import sql from "@/lib/db";

type RemoveRequestQuantityResult =
  | "updated"
  | "deleted"
  | "not_found"
  | "insufficient_quantity";

type CreateRequestResult = "created" | "item_not_found" | "already_exists";

export async function createRequest(
  user_id: number,
  item_id: number,
  quantity: number,
): Promise<CreateRequestResult> {
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
        return "item_not_found";
      }

      const [createdRequest] = await transaction`
        INSERT INTO stockbox.requests (user_id, stock_item_id, quantity)
        VALUES (${user_id}, ${item_id}, ${quantity})
        ON CONFLICT (user_id, stock_item_id) DO NOTHING
        RETURNING id
      `;

      return createdRequest ? "created" : "already_exists";
    });
  } catch (error) {
    console.error("DB: Failed to create stock request", error);
    throw new Error("Database insert failed", { cause: error });
  }
}

export async function addRequestQuantity(
  user_id: number,
  item_id: number,
  quantity: number,
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

      await transaction`
        INSERT INTO stockbox.requests (user_id, stock_item_id, quantity)
        VALUES (${user_id}, ${item_id}, ${quantity})
        ON CONFLICT (user_id, stock_item_id)
        DO UPDATE SET
          quantity = stockbox.requests.quantity + EXCLUDED.quantity,
          updated_at = CURRENT_TIMESTAMP
      `;

      return true;
    });
  } catch (error) {
    console.error("DB: Failed to add stock request quantity", error);
    throw new Error("Database update failed", { cause: error });
  }
}

export async function removeRequestQuantity(
  user_id: number,
  item_id: number,
  quantity: number,
): Promise<RemoveRequestQuantityResult> {
  try {
    return await sql.begin(async (transaction) => {
      const [request] = await transaction`
        SELECT id, quantity
        FROM stockbox.requests
        WHERE user_id = ${user_id}
          AND stock_item_id = ${item_id}
        FOR UPDATE
      `;

      if (!request) {
        return "not_found";
      }

      const remainingQuantity = Number(request.quantity) - quantity;
      if (remainingQuantity < 0) {
        return "insufficient_quantity";
      }

      if (remainingQuantity === 0) {
        await transaction`
          DELETE FROM stockbox.requests
          WHERE id = ${request.id}
        `;
        return "deleted";
      }

      await transaction`
        UPDATE stockbox.requests
        SET quantity = ${remainingQuantity},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${request.id}
      `;
      return "updated";
    });
  } catch (error) {
    console.error("DB: Failed to remove stock request quantity", error);
    throw new Error("Database update failed", { cause: error });
  }
}
