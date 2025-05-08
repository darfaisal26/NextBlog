import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; 

export function middleware(req: Request) {
  const cookies = req.headers.get('cookie') || '';
  const token = cookies.split('; ').find(cookie => cookie.startsWith('token='))?.split('=')[1];

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    jwt.verify(token, JWT_SECRET);

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Apply this middleware only to /blogs routes
export const config = {
  matcher: ['/blogs'],
};
