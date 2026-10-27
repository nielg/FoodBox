import authService from "@/service/authService";
import RequestService from "@/service/stockBox/RequestServices";
import type { ApiResponse } from "@/types";
import { StockRequestQuantitySchema } from "@/types/stock/stock.schema";
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

  const validation = StockRequestQuantitySchema.safeParse(body);
  if (!validation.success) {
    const errorPayload: ApiResponse = {
      success: false,
      message:
        validation.error.issues[0]?.message ?? "Invalid request quantity",
    };
    return Response.json(errorPayload, { status: 400 });
  }

  try {
    const result = await RequestService.createRequest(
      auth.user_id,
      itemId,
      validation.data.quantity,
    );

    if (result === "item_not_found") {
      const errorPayload: ApiResponse = {
        success: false,
        message: "Stock item not found or not accessible",
      };
      return Response.json(errorPayload, { status: 404 });
    }

    if (result === "already_exists") {
      const errorPayload: ApiResponse = {
        success: false,
        message: "A request for this stock item already exists",
      };
      return Response.json(errorPayload, { status: 409 });
    }

    const successPayload: ApiResponse = {
      success: true,
      message: "Stock request created successfully",
    };
    return Response.json(successPayload, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create stock request";
    const errorPayload: ApiResponse = {
      success: false,
      message,
    };
    return Response.json(errorPayload, { status: 500 });
  }
};
