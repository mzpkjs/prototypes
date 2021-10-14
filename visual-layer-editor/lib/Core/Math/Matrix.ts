type Matrix = { a: number, b: number, c: number, d: number, tx: number, ty: number }



export const identity = (): Matrix =>
    ({ a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 })


export const translate = (mA: Matrix, tx: number, ty: number): Matrix =>
    ({ ...mA, ...{ tx, ty } })


export const rotate = (mA: Matrix, radians: number): Matrix  =>
    ({ ...mA, ...{ a: Math.cos(radians), b: -Math.sin(radians), c: Math.sin(radians), d: Math.cos(radians) } })


export const scale = (mA: Matrix, scalar: number): Matrix =>
    ({ ...mA, ...{ a: mA[0] * scalar, b: mA[1] * scalar, c: mA[2] * scalar, d: mA[3] * scalar } })



const Matrix = {
    identity,
    translate,
    rotate,
    scale
}


export default Matrix