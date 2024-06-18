export default function OptimizeQuery(obj) {
    Object.keys(obj).map((key) => {
        if (obj[key] === '') {
            delete obj[key]
        }
    })

    return obj
}
