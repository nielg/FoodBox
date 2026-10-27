import type { APIRoute } from "astro";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import authService from "@/service/authService";
import { UPLOAD_DIR } from "astro:env/server";
export const prerender = false;

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

export const POST: APIRoute = async ({ request, cookies, url }) => {
  const auth = await authService.getAuthenticatedUserId(cookies);

  if (!auth.success) {
    return auth.response;
  }
  const user_id = auth.user_id;

  const file = (await request.formData()).get("image");
  if (
    !(file instanceof File) ||
    !(file.type in ALLOWED) ||
    file.size > 5_000_000
  ) {
    return new Response("Invalid file", { status: 400 });
  }

  const userDir = path.join(UPLOAD_DIR, String(user_id));
  await mkdir(userDir, { recursive: true });
  const name = randomUUID() + ALLOWED[file.type];
  await writeFile(
    path.join(userDir, name),
    Buffer.from(await file.arrayBuffer()),
  );

  const img_path = `/dishBox/images/${user_id}/${name}`;
  return Response.json({ url: new URL(img_path, url.origin).href });
};
