import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname, origin } = req.nextUrl;
    const token = req.nextauth.token; // Adjust based on the actual token structure you receive

    // Additional logic can go here
  },
  {
    // Define your authorization logic
    callbacks: {
      authorized: ({ token }) => {
        return !!token; // Return true if a token exists
      },
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
  ],
};