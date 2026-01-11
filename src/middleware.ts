import {  NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"
export { default } from "next-auth/middleware"

//this function can be marked `async` if you using  `await` inside
export async function middleware(request: NextRequest){

    const token = await getToken({req: request})
    const url = request.nextUrl

    if(token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/') 
    )){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // return NextResponse.redirect(new URL('/home', request.url))
}


//see "matching paths" below to learn more 
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
        
    ]
}