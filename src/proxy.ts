// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { auth } from './lib/auth'
// import { headers } from 'next/headers'

// // This function can be marked `async` if using `await` inside
// export async function proxy(request: NextRequest) {

//     const session = await auth.api.getSession({
//     headers: await headers() // you need to pass the headers object.
// })
//      const user = session?.user

//      if (!user) {
//          return NextResponse.redirect(new URL('/login', request.url))
//      }

//      return NextResponse.next()
// }

// export const config = {
//   matcher: ['/studios-explore/:path', "/dashboard", "/my-bookings", "/add-studio", "/my-listing"],
// }


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user;

  if (!user) {
    const loginUrl = new URL("/login", request.url);

    // User যে পেজে যেতে চেয়েছিল সেটি সংরক্ষণ
    loginUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/studios-explore/:path*",
    "/dashboard/:path*",
    "/my-bookings/:path*",
    "/add-studio/:path*",
    "/my-listing/:path*",
  ],
};