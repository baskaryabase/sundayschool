import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from './types/UserRole';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/teacher/:path*',
    '/student/:path*',
    '/parent/:path*',
    '/api/admin/:path*',
    '/api/teacher/:path*',
    '/api/student/:path*',
    '/api/parent/:path*',
  ],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // If not signed in, redirect to login
  if (!token) {
    const url = new URL('/auth/login', req.url);
    url.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Role-based access control
  if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
    if (token.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else if (path.startsWith('/teacher') || path.startsWith('/api/teacher')) {
    if (token.role !== UserRole.TEACHER && token.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else if (path.startsWith('/student') || path.startsWith('/api/student')) {
    if (token.role !== UserRole.STUDENT && token.role !== UserRole.TEACHER && token.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  } else if (path.startsWith('/parent') || path.startsWith('/api/parent')) {
    if (token.role !== UserRole.PARENT && token.role !== UserRole.ADMIN) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}
