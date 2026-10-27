import authService from "@/service/authService";
import BatchService from "@/service/stockBox/BatchServices";
import type { ApiResponse } from "@/types";
import { StockBatchQuantityRequestSchema } from "@/types/stock/stock.schema";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const auth = await authService.getAuthenticatedUserId(cookies);
  if (!auth.success) {
    return auth.response;
  }

  const itemId = Number(params.item);
  if (!Number.isInteger(itemId) || itemId <= 0) {
    const errorPayload: ApiResponse = {
      success: false,
      message: "Invalid stock item ID",
    };
    return Response.json(errorPayload, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    const errorPayload: ApiResponse = {
      success: false,
      message: "Invalid JSON request body",
    };
    return Response.json(errorPayload, { status: 400 });
  }

  const validation = StockBatchQuantityRequestSchema.safeParse(body);
  if (!validation.success) {
    const errorPayload: ApiResponse = {
      success: false,
      message: validation.error.issues[0]?.message ?? "Invalid batch data",
    };
    return Response.json(errorPayload, { status: 400 });
  }

  try {
    const itemExists = await BatchService.addItemQuantity(
      auth.user_id,
      itemId,
      validation.data.quantity,
      validation.data.expireDate,
    );

    if (!itemExists) {
      const errorPayload: ApiResponse = {
        success: false,
        message: "Stock item not found or not accessible",
      };
      return Response.json(errorPayload, { status: 404 });
    }

    const successPayload: ApiResponse = {
      success: true,
      message: "Inventory batch added successfully",
    };
    return Response.json(successPayload, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add inventory batch";
    const errorPayload: ApiResponse = {
      success: false,
      message,
    };
    return Response.json(errorPayload, { status: 500 });
  }
};
