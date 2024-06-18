export default function OptimizeQuery2(obj, char = '') {
    function ObjectToQuery(object) {
        return Object.keys(object)
            .map((key) => key + '=' + object[key])
            .join('&')
    }

    Object.keys(obj).map((key) => {
        if (obj[key] === char) {
            delete obj[key]
        }
    })

    return ObjectToQuery(obj)
}
