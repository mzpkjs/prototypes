import Matrix, { rotate, translate } from "../Math/Matrix"
import Vector, { add, direction, distance, normalize, scale, subtract } from "../Math/Vector"
import Point from "./Point"
import Shape from "./Shape"



class Line extends Shape {
    private readonly _pointA: Point
    private readonly _pointB: Point

    constructor(pointA: Point, pointB: Point) {
        super()
        this.origin = { x: 0, y: 0.5 }

        this._pointA = pointA
        this._pointB = pointB

        const inner = document.createElement("div")
        inner.className = "shape line"
        this.element.style.height = "0"
        this.element.append(inner)
    }

    public prepare(canvas: HTMLElement): void {
        super.prepare(canvas)
        this._pointA.prepare(canvas)
        this._pointB.prepare(canvas)
    }

    public destroy(): void {
        super.destroy()
        this._pointA.destroy()
        this._pointB.destroy()
    }

    public draw(): void {
        this._pointA.draw()
        this._pointB.draw()

        this.element.style.width = `${distance(this.a, this.b)}px`

        this._transform = translate(this._transform, this.origin.x, -this.height * this.origin.y)
        this._transform = rotate(this._transform, this.direction)
        super.draw()
    }

    public get position() {
        return { x: this.x, y: this.y }
    }

    public set position(value: Vector) {
        const offset = subtract(this.b, this.a)
        this.a = value
        this.b = add(value, offset)
    }

    public get x() {
        return this.ax
    }

    public set x(value: number) {
        this.position = { x: value, y: this.y }
    }

    public get y() {
        return this.ay
    }

    public set y(value: number) {
        this.position = { x: this.x, y: value }
    }

    public get a() {
        return this._pointA.position
    }

    public set a(value: Vector) {
        this._pointA.position = value
    }

    public get b() {
        return this._pointB.position
    }

    public set b(value: Vector) {
        this._pointB.position = value
    }

    public get ax() {
        return this.a.x
    }

    public set ax(value: number) {
        this.a.x = value
    }

    public get bx() {
        return this.b.x
    }

    public set bx(value: number) {
        this.b.x = value
    }

    public get ay() {
        return this.a.y
    }

    public set ay(value: number) {
        this.a.y = value
    }

    public get by() {
        return this.b.y
    }

    public set by(value: number) {
        this.b.y = value
    }

    public get direction() {
        return direction(normalize(subtract(this.a, this.b)))
    }

    public set direction(value: number) {
        const delta = value - this._direction
        this.b = Vector.rotate(this.b, this.a, delta)
        this._direction = direction(normalize(subtract(this.a, this.b)))
    }
}


export default Line