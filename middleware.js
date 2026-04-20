// middleware.js - Simplified version (mostly disabled)
import { NextResponse } from "next/server";

export function middleware(request) {
  // Let all requests through - client-side auth handles protection
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
