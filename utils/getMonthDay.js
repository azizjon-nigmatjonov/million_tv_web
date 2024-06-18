export default function getMonthDay() {
    const date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth()

    month = month - 1

    var newDate = new Date(year, month)
    var days = []

    while (newDate.getMonth() === month) {
        days.push(new Date(newDate))
        newDate.setDate(newDate.getDate() + 1)
    }

    return days.length
}
