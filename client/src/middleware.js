import { NextResponse } from 'next/server';

export function middleware(request) {
  let response = NextResponse.next();
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (request.nextUrl.pathname.startsWith('/auth')) {
    if (refreshToken) {
      return NextResponse.rewrite(new URL('/', request.url));
    }
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!refreshToken) {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
    const tokenInfo = refreshToken.split('.')[1];
    const tokenInfoDecoded = atob(tokenInfo);
    const { role } = JSON.parse(tokenInfoDecoded);

    if (role !== 'admin') {
      return NextResponse.rewrite(new URL('/404', request.url));
    }
  }
}
