import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

const publicRoutes = ['/', '/login', '/signup', '/forgot-password']
const protectedRoutes = ['/dashboard', '/profile', '/settings', '/sleep']

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // Skip Next.js internals, API routes, and static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )

  // Update these cookie names to match the app
  const token =
    request.cookies.get('token')?.value ||
    request.cookies.get('auth-token')?.value ||
    request.cookies.get('session')?.value

  // Redirect unauthenticated users away from protected pages
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  // Prevent authenticated users from going back to auth pages
  if (token && isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}