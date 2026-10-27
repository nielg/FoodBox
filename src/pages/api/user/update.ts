import type { APIRoute } from "astro";
import { createUserSchema } from "./register";
import { handleZodValidationError } from "@/service";
import authService from "@/service/authService";
import UserService from "@/service/userService";

const updateUserSchema = createUserSchema.partial();

export const PUT: APIRoute = async ({
  request,
  cookies,
}): Promise<Response> => {
  const auth = await authService.getAuthenticatedUserId(cookies);
  if (!auth.success) {
    return auth.response;
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { success: false, message: "Invalid JSON request body" },
      { status: 400 },
    );
  }

  const data = updateUserSchema.safeParse(body);
  if (!data.success) {
    return handleZodValidationError(data.error);
  }

  try {
    await UserService.updateUser(auth.user_id, data.data);

    return Response.json(
      { success: true, message: "User updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update user";

    return Response.json({ success: false, message }, { status: 500 });
  }
};
