import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Export function named 'proxy' (or 'export default function proxy')
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};