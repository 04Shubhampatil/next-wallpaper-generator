import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname; // current path

  const isPublic =
    path === "/login" ||
    path === "/register"; // these are public routes without login you can access

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url)); // if token is not present redirect to login
  }

  if (token) {
    const user = getUser(token); // verify token

    if (!user) {
      const response = NextResponse.redirect(
        new URL("/login", request.url)
      );
      response.cookies.delete("token"); // if token is not valid delete token
      return response; // redirect to login
    }

    if (isPublic) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
