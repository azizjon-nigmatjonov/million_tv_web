import { destroyCookie } from 'nookies'

export const logout = (ctx) => {
    destroyCookie(ctx || null, 'access_token', {
        path: '/',
    })
    destroyCookie(ctx || null, 'session_id', {
        path: '/',
    })
    destroyCookie(ctx || null, 'user_id', {
        path: '/',
    })
}
