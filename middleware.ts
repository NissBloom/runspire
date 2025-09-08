import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // No authentication checks needed
  return NextResponse.next()
}

// Configure which paths the middleware runs on (empty for now)
export const config = {
  matcher: [],
}
