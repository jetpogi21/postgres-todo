import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
export async function middleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  await supabase.auth.getSession();

  response.headers.set("Access-Control-Allow-Origin", "*");

  /* 
  //Another option allow only if the origin matches the desired origin
  if (origin){
    const originRegex = /^https:\/\/www\.mydomain\.com$/;
    if (originRegex.test(origin)) {
      // Allow only this origin
      response.headers.set("Access-Control-Allow-Origin", origin);
    } else {
      // Deny any other origin
      response.headers.set("Access-Control-Allow-Origin", "null");
    }
  }
 */
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  console.log("Middleware!");
  console.log(request.method);
  console.log(request.url);

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
