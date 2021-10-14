import EventListener, { EventType } from "../Event/EventListener"
import Matrix from "../Math/Matrix"
import Vector, { subtract } from "../Math/Vector"



export namespace ShapeEvent {
    export interface MoveEvent extends CustomEvent {

    }
}

export enum ShapeEvent {
    MOVE = "shape:move",
    MOVE_START = "shape:movestart",
    MOVE_END = "shape:moveend",
}


abstract class Shape implements Vector {
    public abstract position: Vector
    public abstract x: number
    public abstract y: number
    public abstract a: Vector
    public abstract b: Vector
    public abstract ax: number
    public abstract ay: number
    public abstract bx: number
    public abstract by: number

    private readonly _element: HTMLElement
    protected _transform = Matrix.identity()
    protected _origin: Vector = { x: 0.5, y: 0.5 }
    protected _scale: Vector = { x: 1, y: 1 }
    protected _direction: number = 0
    private _state = {
        isActive: false,
        isMoving: false,
        payloads: {
            move: {
                shape: this,
                destination: this as Vector,
                offset: { x: 0, y: 0 }
            }
        }
    }


    protected constructor() {
        this._element = document.createElement("div")
        this._element.style.position = "absolute"
        this._element.style.zIndex = "100"
        this._element.style["mix-blend-mode"] = "exclusion"
        this._element.style["-webkit-font-smoothing"] = "subpixel-antialiased"
    }


    public prepare(canvas: HTMLElement): void {
        canvas.append(this._element)

        this._handleMouseMove
            .subscribe(document)
        this._handleMouseDown
            .subscribe(this.element)
        this._handleMouseUp
            .subscribe(document)
    }

    public destroy(): void {
        this._handleMouseMove
            .destroy()
        this._handleMouseDown
            .destroy()
        this._handleMouseUp
            .destroy()
        this._element.remove()
    }

    public draw(): void {
        const { a, b, c, d, tx, ty } = this._transform
        this.element.style.transformOrigin = `${this.origin.x * 100}% ${this.origin.y * 100}%`
        this.element.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${this.x + tx}, ${this.y + ty})`
    }


    public get element() {
        return this._element
    }

    public get dimension() {
        return { x: this.width, y: this.height }
    }

    public get width() {
        return this._element.offsetWidth
    }

    public get height() {
        return this._element.offsetHeight
    }

    public get origin() {
        return this._origin
    }

    public set origin(value: Vector) {
        this._origin = value
    }

    public get scale() {
        return this._origin
    }

    public set scale(value: Vector) {
        this._scale = value
    }

    public get direction() {
        return this._direction
    }

    public set direction(value: number) {
        this._direction = value
    }


    private _handleMouseMove = new EventListener(EventType.MOUSE_MOVE, (event: MouseEvent) => {
        event.preventDefault()
        if (this._state.isActive) {
            const { move: payload } = this._state.payloads
            payload.shape = this
            payload.destination = {
                x: event.pageX - this.element.parentElement.offsetLeft,
                y: event.pageY - this.element.parentElement.offsetTop
            }

            if (this._state.isMoving) {
                this.element.dispatchEvent(
                    new CustomEvent(ShapeEvent.MOVE, {
                        bubbles: true,
                        detail: payload
                    })
                )
            } else {
                this._state.payloads.move.offset = subtract(payload.shape, payload.destination)
                this.element.dispatchEvent(
                    new CustomEvent(ShapeEvent.MOVE_START, {
                        bubbles: true,
                        detail: payload
                    })
                )
                this._state.isMoving = true
            }
        }
    })

    private _handleMouseDown = new EventListener(EventType.MOUSE_DOWN, (event: MouseEvent) => {
        event.preventDefault()
        if (!this._state.isMoving) {
            this.element.classList.add("active")
            this._state.isActive = true
        }
    })

    private _handleMouseUp = new EventListener(EventType.MOUSE_UP, (event: MouseEvent) => {
        event.preventDefault()
        if (this._state.isMoving) {
            this.element.classList.remove("active")
            this._state.isActive = false
            this._state.isMoving = false

            const { move: payload } = this._state.payloads
            this.element.dispatchEvent(new CustomEvent(ShapeEvent.MOVE_END, {
                bubbles: true,
                detail: payload
            }))
        }
    })
}


export default Shape