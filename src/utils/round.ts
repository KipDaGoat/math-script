export default function round(num: number, digits: number = 0): number {
    if (digits <= 0 || digits === null) digits = 0
    else digits = Math.round(digits)

    return Math.round(num * 10 ** digits) / 10 ** digits
}
