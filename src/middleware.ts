import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'thomasIsAwesomeCoolGuy';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api') &&
    !request.nextUrl.pathname.startsWith('/api/auth/login') &&
    !request.nextUrl.pathname.startsWith('/api/auth/register')) {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json(
        { error: '未授權訪問' },
        { status: 401 }
      );
    }

    try {
      await jose.jwtVerify(token, secret);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: '無效的令牌' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}