import axios from 'axios'
import { QueryClient } from 'react-query'
import { store } from 'store/store'
import { logout } from '../utils/logout'
import nookies from 'nookies'

export const request = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: 15000,
})

const errorHandler = (error) => {
    if (error && error.response) {
        if (error?.response?.data?.error?.code === 401) {
            // store.dispatch(logout())
            location.replace('/')
        }
    }

    return Promise.reject(error.response)
}

request.interceptors.request.use(
    (config) => {
        const cookies = nookies.get()
        const token = cookies.access_token
        const uuid = cookies.session_id

        if (token) {
            config.headers.Authorization = token
            config.headers['SessionId'] = uuid
        }
        return config
    },

    (error) => errorHandler(error),
)

request.interceptors.response.use((response) => {
    return response.data.data ?? response?.data
}, errorHandler)

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
})
