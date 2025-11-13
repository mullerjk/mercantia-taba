import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabase = await createServerSupabaseClient()

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes - accessible without authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
    '/auth/callback',
    '/', // Main page (dashboard with marketplace)
  ]

  // Marketplace-related routes that should be public
  const marketplaceRoutes = [
    '/organization/',
    '/product/',
    '/person/',
    '/entity/',
    '/department/',
    '/api/marketplace',
    '/api/entities',
    '/api/schema-hierarchy'
  ]

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route) ||
                        marketplaceRoutes.some(route => pathname.startsWith(route))

  // Check if current route is auth-related
  const isAuthRoute = ['/auth/login', '/auth/register', '/auth/reset-password'].some(route =>
    pathname.startsWith(route)
  )

  // If user is not authenticated and trying to access protected route
  if (!user && !isPublicRoute && !isAuthRoute) {
    // Redirect to login page with return url
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (isAuthRoute && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo') || '/'
    const url = request.nextUrl.clone()
    url.pathname = redirectTo
    return NextResponse.redirect(url)
  }

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  await supabase.auth.getUser()

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
