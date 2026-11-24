import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Hanya periksa rute /admin/*
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseUrl.startsWith("http")) {
    supabaseUrl = "https://vhtdewkxwhysvjlopevi.supabase.co";
  }

  if (!supabaseAnonKey || supabaseAnonKey.startsWith("sb_secret_")) {
    supabaseAnonKey = "sb_publishable_yDL2KF3NTRP93OJNZnPIJw_mPOKBmq3";
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (pathname === "/admin/login") {
      if (user) {
        const redirectRes = NextResponse.redirect(new URL("/admin", request.url));
        supabaseResponse.cookies.getAll().forEach((c) => {
          redirectRes.cookies.set(c.name, c.value);
        });
        return redirectRes;
      }
      return supabaseResponse;
    }

    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return supabaseResponse;
  } catch {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}
