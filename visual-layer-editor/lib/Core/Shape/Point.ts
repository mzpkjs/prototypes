import Matrix, { rotate, translate } from "../Math/Matrix"
import Vector from "../Math/Vector"
import Shape  from "./Shape"



class Point extends Shape {
    private _position: Vector

    constructor(x: number, y: number) {
        super()
        this._position = { x, y }
        this.element.className = "shape point"
        this.element.style.cursor = "pointer"
    }

    public prepare(canvas: HTMLElement): void {
        super.prepare(canvas)
    }

    public destroy(): void {
        super.destroy()
    }

    public draw(): void {
        this._transform = translate(this._transform, -this.width * this.origin.x, -this.height * this.origin.y)
        this._transform = rotate(this._transform, this.direction)

        const { a, b, c, d, tx, ty } = this._transform
        this.element.style.transformOrigin = `${this.origin.x * 100}% ${this.origin.y * 100}%`
        this.element.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${this.x + tx}, ${this.y + ty})`
    }

    public get position() {
        return { x: this.x, y: this.y }
    }

    public set position(value: Vector) {
        this.x = value.x
        this.y = value.y
    }

    public get x() {
        return this._position.x
    }

    public set x(value: number) {
        this._position.x = value
    }

    public get y() {
        return this._position.y
    }

    public set y(value: number) {
        this._position.y = value
    }

    public get a() {
        return { x: this.ax, y: this.bx }
    }

    public get b() {
        return { x: this.bx, y: this.by }
    }

    public get ax() {
        return this.x - this.width * this.origin.x
    }

    public get ay() {
        return this.y - this.height * this.origin.y
    }

    public get bx() {
        return this.x + this.width * (1 - this.origin.x)
    }

    public get by() {
        return this.y - this.width * (1 - this.origin.y)
    }
}


export default Point