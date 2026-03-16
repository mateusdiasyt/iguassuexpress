import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  (request) => {
    if (
      request.nextUrl.pathname === "/admin/login" &&
      request.nextauth.token
    ) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.next();
  },
  {
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === "/admin/login") {
          return true;
        }

        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*"],
};
