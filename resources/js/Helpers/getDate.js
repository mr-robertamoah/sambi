export default function getDate(dateStr) {
    let date = dateStr ? new Date(dateStr) : new Date()
    let month = ("0" + (date.getMonth() + 1)).slice(-2)
    let day = ("0" + date.getUTCDate()).slice(-2)

    return `${date.getUTCFullYear()}-${month}-${day}`
}