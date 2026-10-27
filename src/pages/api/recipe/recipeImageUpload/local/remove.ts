import type { APIRoute } from "astro";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "astro:env/server";
import authService from "@/service/authService";
import recipeService from "@/service/dishBox/recipeService";

export const prerender = false;

export const DELETE: APIRoute = async ({ request, cookies, url }) => {
  const auth = await authService.getAuthenticatedUserId(cookies);
  if (!auth.success) return auth.response;
  const user_id = String(auth.user_id);

  const body = await request.json().catch(() => null);
  if (!Array.isArray(body) || !body.every((u) => typeof u === "string")) {
    return new Response("Expected an array of URLs", { status: 400 });
  }
  if (body.length === 0) return Response.json({ deleted: 0 });

  const img_urls = await recipeService.deleteRecipeImages(user_id, body);

  const root = path.resolve(UPLOAD_DIR);
  const userRoot = path.join(root, user_id);

  img_urls.forEach(async (img_url) => {
    const pathname = new URL(img_url, url.origin).pathname;
    if (!pathname.includes("/images/")) return;

    const name = path.basename(pathname);
    const filePath = path.resolve(userRoot, name);

    // Containment check: must stay inside this user's folder
    if (!filePath.startsWith(userRoot + path.sep)) return;

    try {
      await unlink(filePath);
    } catch (err: any) {
      if (err.code !== "ENOENT") {
        console.error(`Failed to delete ${filePath}:`, err);
      }
    }
  });

  return Response.json({ deleted: img_urls.length });
};
