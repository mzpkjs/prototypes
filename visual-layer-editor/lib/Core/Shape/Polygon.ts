import RotatableBehaviour from "../Behaviour/RotatableBehaviour"
import Matrix, { translate } from "../Math/Matrix"
import Vector, { distance, divide, rotate, subtract } from "../Math/Vector"
import Line from "./Line"
import Point from "./Point"
import Shape, { ShapeEvent } from "./Shape"



class Polygon extends Shape {
    private readonly _rotatable = new RotatableBehaviour(this)
    private readonly _shapes: Shape[]
    private readonly _points: Point[]

    constructor(...points: Point[]) {
        super()
        this._points = points

        this._shapes = []
        for (let i = 0, j = i + 1; i < points.length; i++, j++) {
            if (j < points.length) {
                this._shapes.push(points[i], new Line(points[i], points[j]))
            } else {
                this._shapes.push(points[i], new Line(points[i], points[0]))
            }
        }

        this.element.className = "shape polygon"
        this.element.style.cursor = "move"
    }

    public prepare(canvas: HTMLElement): void {
        super.prepare(canvas)
        for (const shape of this._shapes) {
            shape.prepare(canvas)
        }
    }

    public destroy(): void {
        super.destroy()
        for (const shape of this._shapes) {
            shape.destroy()
        }
    }

    public draw(): void {
        for (const shape of this._shapes) {
            shape.draw()
        }

        this.element.style.width = `${this.width}px`
        this.element.style.height = `${this.height}px`

        this._transform = translate(this._transform, -this.width * this.origin.x, -this.height * this.origin.y)
        super.draw()
    }

    public get points() {
        return this._points
    }

    public get width() {
        return this.bx - this.ax
    }

    public get height() {
        return this.by - this.ay
    }

    public get innerDimension() {
        return { x: this.innerWidth, y: this.innerHeight }
    }

    public get innerWidth() {
        return distance(this.a, { x: this.bx, y: this.ay })
    }

    public get innerHeight() {
        return distance(this.a, { x: this.ax, y: this.by })
    }

    public get position() {
        const x = this.ax + this.width * this.origin.x,
            y = this.ay + this.height * this.origin.y
        return { x, y }
    }

    public set position(value: Vector) {
        const position = this.position
        for (const point of this._points) {
            const delta = subtract(point.position, position)
            if (point.x === position.x) {
                point.x = value.x
            } else if (point.x < position.x) {
                point.x = value.x + delta.x
            } else if (point.x > position.x) {
                point.x = value.x + delta.x
            }

            if (point.y === position.y) {
                point.y = value.y
            } else if (point.y < position.y) {
                point.y = value.y + delta.y
            } else if (point.y > position.y) {
                point.y = value.y + delta.y
            }
        }
    }

    public get x() {
        return this.position.x
    }

    public set x(value: number) {
        this.position = { x: value, y: this.y }
    }

    public get y() {
        return this.position.y
    }

    public set y(value: number) {
        this.position = { x: this.x, y: value }
    }

    public get a() {
        return { x: this.ax, y: this.ay }
    }

    public get b() {
        return { x: this.bx, y: this.by }
    }

    public get ax() {
        return Math.min(...this._points.map(point => point.x))
    }

    public get ay() {
        return Math.min(...this._points.map(point => point.y))
    }

    public get bx() {
        return Math.max(...this._points.map(point => point.x))
    }

    public get by() {
        return Math.max(...this._points.map(shape => shape.y))
    }

    public get scale() {
        return this._scale
    }

    public set scale(value: Vector) {
        const delta = divide(value, this._scale)

        const previousOrigin = this.origin
        const previousDirection = this._direction

        this.origin = { x: 0.5, y: 0.5 }
        this.direction = 0
        this.origin = previousOrigin
        const w = this.width * 0.5
        const h = this.height * 0.5

        const { x, y } = this.position
        for (const point of this._points) {
            point.x = ((delta.x) * (point.x - x)) + x
            point.y = ((delta.y) * (point.y - y)) + y
        }

        this.origin = { x: Math.abs(previousOrigin.x - (w / this.width)), y: Math.abs((h / this.height) - previousOrigin.y) }
        this.direction = previousDirection
        this.origin = previousOrigin

        this._scale = value
    }

    public get direction() {
        return super.direction
    }

    public set direction(value: number) {
        if (Math.abs(value) >= 2 * Math.PI) {
            value = 0
        }

        const delta = value - super.direction
        const position = this.position
        for (const point of this._points) {
            point.position = rotate(position, point, delta)
            point.direction = value
        }

        super.direction = value
    }
}


export default Polygon