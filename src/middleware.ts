import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Redirect authenticated users away from login/register
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow unauthenticated access to login and register
        if (pathname === "/login" || pathname === "/register") {
          return true
        }

        // Require auth for all protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/contacts/:path*",
    "/deals/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
}
