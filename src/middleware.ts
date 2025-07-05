export { default } from "next-auth/middleware";

// The config object specifies which routes the middleware should apply to.
export const config = {
  matcher: [
    // We are protecting the main dashboard and any sub-routes it might have.
    "/dashboard/:path*",
  ],
};
