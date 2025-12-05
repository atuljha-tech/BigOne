// middleware.ts - UPDATED
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('auth-token')?.value;
  const path = request.nextUrl.pathname;
  
  console.log(`🛡️ Middleware checking: ${path}`);
  console.log(`🔐 Token exists: ${!!token}`);

  // Public paths
  const publicPaths = [
    '/',
    '/auth/login',
    '/auth/direct-login',
    '/auth/register',
    '/api/auth/register',
    '/api/auth/direct-login',
  ];

  // Check if path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(publicPath + '/')
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // If no token
  if (!token) {
    return NextResponse.redirect(new URL('/auth/direct-login', request.url));
  }

  try {
    // Verify token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    console.log(`✅ User authenticated: ${payload.email}, Role: ${payload.role}`);

    // Role-based access
    if (path.startsWith('/organiser') && payload.role !== 'organizer') {
      return NextResponse.redirect(new URL('/auth/direct-login', request.url));
    }

    if (path.startsWith('/user') && payload.role !== 'user') {
      return NextResponse.redirect(new URL('/auth/direct-login', request.url));
    }

    return NextResponse.next();

  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    
    // Clear invalid cookies and redirect
    const response = NextResponse.redirect(new URL('/auth/direct-login', request.url));
    response.cookies.delete('auth-token');
    response.cookies.delete('user-session');
    
    return response;
  }
}

export const config = {
  matcher: [
    '/organiser/:path*',
    '/user/:path*',
  ],
};