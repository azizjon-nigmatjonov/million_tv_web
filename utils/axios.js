import axios from 'axios'
import nookies from 'nookies'
import { logout } from './logout'

const authRequest = axios.create({
    baseURL: process.env.BASE_URL,
    // baseURL: 'https://test.spectator.api.milliontv.uz/v1/',
    timeout: 15000,
})
const authRequestForTvChannel = axios.create({
    baseURL: process.env.BASE_URL,
    timeout: 15000,
})
const errorHandler = (error) => {
    if (error?.response?.status === 401) {
        logout()
        // location.replace('/registration')
    }

    return Promise.reject(error.response)
}

authRequest.interceptors.request.use((config) => {
    const cookies = nookies.get()
    const token = cookies.access_token
    const uuid = cookies.session_id

    if (token && uuid) {
        config.headers.Authorization = token
        config.headers['SessionId'] = uuid
    }
    return config
})
authRequestForTvChannel.interceptors.request.use((config) => {
    const cookies = nookies.get()
    const token = cookies.access_token
    const uuid = cookies.session_id

    if (token && uuid) {
        config.headers = {
            'Content-Type': 'image/svg',
        }
    }
    return config
})

authRequest.interceptors.response.use((response) => response, errorHandler)
authRequestForTvChannel.interceptors.response.use(
    (response) => response,
    errorHandler,
)
export { authRequestForTvChannel }
export default authRequest
