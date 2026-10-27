import { defineMiddleware } from "astro:middleware";
import { COOKIE_NAME, COOKIE_SECRET } from "astro:env/server";
import jwt from "jsonwebtoken";

export const onRequest = defineMiddleware((context, next) => {
  const tokenCookie = context.cookies.get(COOKIE_NAME);

  let authenticated: boolean = false;
  // Attempt token verification
  if (tokenCookie?.value) {
    try {
      const decoded = jwt.verify(tokenCookie.value, COOKIE_SECRET) as {
        username?: string;
        id?: number;
      } | null;

      if (decoded?.username) {
        authenticated = true;
        context.locals.username = decoded.username;
        context.locals.user_id = decoded.id;
      }
    } catch (error) {
      // Invalid/expired token: clear the bad cookie
      context.cookies.delete(COOKIE_NAME);
    }
  }

  // Define protected paths (use exact path prefixes, omit wildcards)
  const protectedRoutes = ["/dishBox", "/user/profile"];
  const url = new URL(context.request.url);

  const isProtectedRoute = protectedRoutes.some((path) =>
    url.pathname.startsWith(path),
  );

  if (isProtectedRoute && !context.locals.user_id) {
    return context.redirect("/user/login");
  }

  return next();
});
