export default function formatMoney(number) {
    let numberStr = String(number)

    let groups = []
    while (numberStr.length > 3) {
        groups.unshift(numberStr.slice(-3))
        numberStr = numberStr.slice(0, -3)
    }
    groups.unshift(numberStr)

    return groups.join(' ')
}
