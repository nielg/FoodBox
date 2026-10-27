import authService from "@/service/authService";
import ItemService from "@/service/stockBox/ItemServices";
import type { ApiResponse } from "@/types";
import { StockItemRequestSchema } from "@/types/stock/stock.schema";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await authService.getAuthenticatedUserId(cookies);
  if (!auth.success) {
    return auth.response;
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

  const validation = StockItemRequestSchema.safeParse(body);
  if (!validation.success) {
    const errorPayload: ApiResponse = {
      success: false,
      message: validation.error.issues[0]?.message ?? "Invalid stock item",
    };
    return Response.json(errorPayload, { status: 400 });
  }

  try {
    const item = await ItemService.createStockItem(
      auth.user_id,
      validation.data,
    );

    const successPayload: ApiResponse<typeof item> = {
      success: true,
      message: "Stock item created successfully",
      data: item,
    };
    return Response.json(successPayload, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create stock item";
    const errorPayload: ApiResponse = {
      success: false,
      message,
    };
    return Response.json(errorPayload, { status: 500 });
  }
};
