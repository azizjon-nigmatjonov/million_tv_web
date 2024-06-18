import axios from 'utils/axios'
import { parseCookies } from 'nookies'
const baseUrl = process.env.BASE_URL

export const fetchMultipleUrls = async (requests, ctx) => {
    let data
    let headers = {}

    const cookies = parseCookies(ctx)

    if (cookies.access_token) {
        headers.Authorization = cookies.access_token
    }

    if (cookies.session_id) {
        headers.SessionId = cookies.session_id
    }

    data = await Promise.all(
        requests.map(async (request) => {
            try {
                const response = request.endpoint
                    ? await axios({
                          url: baseUrl + request.endpoint,
                          method: request?.method || 'GET',
                          ...(request.body && { data: request.body }),
                          headers: {
                              ...headers,
                          },
                      })
                    : await axios.get(baseUrl + request, {
                          headers: {
                              ...headers,
                          },
                      })
                return response.data
            } catch (e) {
                return null
            }
        }),
    )

    return data
}
