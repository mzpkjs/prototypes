import exp = require("constants")



type Vector = { x: number, y: number }


export const create = (x: number, y: number = x) =>
    ({ x: x, y: y })


export const add = (vA: Vector, vB: Vector): Vector =>
    ({ x: vA.x + vB.x, y: vA.y + vB.y })


export const subtract = (vA: Vector, vB: Vector): Vector =>
    ({ x: vA.x - vB.x, y: vA.y - vB.y })


export const multiply = (vA: Vector, vB: Vector): Vector =>
    ({ x: vA.x * vB.x, y: vA.y * vB.y })


export const divide = (vA: Vector, vB: Vector): Vector =>
    ({ x: vA.x / vB.x, y: vA.y / vB.y })


export const rotate = (vA: Vector, vB: Vector, radian: number): Vector => {
    const run = vB.x - vA.x,
        rise = vB.y - vA.y
    return {
        x: (Math.cos(radian) * run) + (Math.sin(radian) * rise) + vA.x,
        y: (Math.cos(radian) * rise) - (Math.sin(radian) * run) + vA.y
    }
}


export const rotate2 = (vA: Vector, radian: number): Vector => {
    return {
        x: (vA.x * Math.cos(radian)) - (vA.y * Math.sin(radian)),
        y: (vA.x * Math.sin(radian)) + (vA.y * Math.cos(radian))
    }
}


export const dot = (vA: Vector, vB: Vector): number => {
    return vA.x * vB.x + vA.y * vB.y;
}


export const scale = (vA: Vector, scalar: number): Vector =>
    multiply(vA, { x: scalar, y: scalar })


export const normalize = (vA: Vector): Vector => {
    const scalar = 1 / length(vA)
    return scale(vA, scalar === Infinity ? 0 : scalar)
}


export const length = (vA: Vector): number =>
    Math.sqrt(vA.x * vA.x + vA.y * vA.y)


export const distance = (vA: Vector, vB: Vector): number =>
    Math.hypot(vB.x - vA.x, vB.y - vA.y)


export const direction = (vA: Vector): number =>
    -Math.atan2(vA.y, vA.x) - Math.PI


export const ap = (vA: Vector, f: (component: number) => number) =>
    ({ x: f(vA.x), y: f(vA.y) })



const Vector = {
    create,
    add,
    subtract,
    multiply,
    divide,
    rotate,
    scale,
    length,
    distance,
    direction,
    normalize,
    ap,
    dot
}


export default Vector