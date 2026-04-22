import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        if (!token) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Restrict paths based on role
        if (path.startsWith("/admin") && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (path.startsWith("/seller") && token.role !== "SELLER") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (path.startsWith("/buyer") && token.role !== "BUYER") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Return true here, and let the middleware function handle the logic.
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*", "/seller/:path*", "/buyer/:path*"],
};
