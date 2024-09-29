import { NextRequest, NextResponse } from 'next/server';
export { default } from 'next-auth/middleware';
import { decode } from 'next-auth/jwt';

const AUTH_PAGES = ['/login', "/register", "/forgot-password","/reset-password"]

const isAuthPages = (url: string) => AUTH_PAGES.some(page => page.startsWith(url))

export async function middleware(request: NextRequest) {
    const { url, nextUrl, cookies } = request

    const { value: token } = (cookies.get('next-auth.session-token') || cookies.get('__Secure-next-auth.session-token') )?? { value: null }

    const hasVerifiedToken = await decode({
        token: token as string,
        secret: process.env.NEXTAUTH_SECRET as string,
    });

    const isAuthPageRequested = isAuthPages(nextUrl.pathname)

    if (isAuthPageRequested) {
        if (!hasVerifiedToken) {
            return NextResponse.next()
        }
        return NextResponse.redirect(new URL('/', url))
    }


    if (!hasVerifiedToken) {


        const searchParams = new URLSearchParams(nextUrl.searchParams)
        searchParams.set('next', nextUrl.pathname)
        return NextResponse.redirect(new URL(`/login?${searchParams}`, url))
    }

    return NextResponse.next()

}

export const config = {
    matcher: ["/login", "/register", "/forgot-password","/reset-password","/saved-posts","/account/:path*", "/write", "/saved-posts","/edit/:path*","/notifications"]
}