import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidSession } from '@/lib/auth';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_session')?.value;
  if (!isValidSession(token)) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/write/:path*'],
};
