const baseUrl = process.env.BASE_URL

async function fetchQuery(path, params = null, headers) {
    return new Promise(async (resolve, reject) => {
        let url
        if (params !== null) {
            url = `${baseUrl}/${path}/${params}`
        } else {
            url = `${baseUrl}/${path}`
        }

        try {
            let timeout = setTimeout(() => {
                // return new Error('time-out')
                reject('time-out')
            }, 8000)
            const response = await fetch(`${url}`, { headers })
            const data = await response.json()
            clearTimeout(timeout)
            resolve(data)
        } catch (err) {
            reject(err)
        }
    })
}

export { baseUrl, fetchQuery }
