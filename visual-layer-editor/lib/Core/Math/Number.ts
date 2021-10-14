export const round = (number: number, precision: number = 0) => {
    precision = (10 * precision) || 1
    return Math.round((number + Number.EPSILON) * precision) / precision
}