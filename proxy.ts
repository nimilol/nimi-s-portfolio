// Runs before every /admin page. Keeps the login fresh and sends
// anyone who isn't the admin to /admin/login.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();

  // Supabase not connected yet: only the login page (which explains what to do) is reachable.
  if (!url || !key) {
    return isLoginPage ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers ?? {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  const isAdmin = !!adminEmail && data.user?.email?.toLowerCase() === adminEmail;

  if (!isAdmin && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (isAdmin && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
