import EventListener from "../Core/Event/EventListener"
import Vector, { add, ap, distance, divide, dot, multiply, normalize, rotate, scale, subtract, length } from "../Core/Math/Vector"
import Point from "../Core/Shape/Point"
import Polygon from "../Core/Shape/Polygon"
import { ShapeEvent } from "../Core/Shape/Shape"



type State = {
    initialHorizontalPoint: Vector,
    initialVerticalPoint: Vector,
    initialPolygonOrigin: Vector,
    initialPolygonOriginOffset: Vector,
    initialPolygonScale: Vector
    initialActivePoint: Vector,
    initialFarthestPoint: Vector,
}


class UnlockedScalingStrategy {
    private readonly _canvas: HTMLElement
    private readonly _polygon: Polygon
    private readonly _points: Record<keyof { a, ab, b, bc, c, cd, d, da }, Point>
    private _state?: State
    private _i: HTMLElement
    private _j: HTMLElement

    constructor(canvas: HTMLElement, polygon: Polygon, points: Record<keyof { a, ab, b, bc, c, cd, d, da }, Point>) {
        this._canvas = canvas
        this._polygon = polygon
        this._points = points

        this._handleMove
            .subscribe(this._polygon.element)
        for (const point of this._polygon.points) {
            this._handleResize
                .subscribe(point.element)
            this._handleResizeStart
                .subscribe(point.element)
            this._handleResizeEnd
                .subscribe(point.element)
        }
    }

    public destroy(): void {
        this._handleMove
            .destroy()
        this._handleResize
            .destroy()
        this._handleResizeStart
            .destroy()
        this._handleResizeEnd
            .destroy()
    }

    private readonly _handleMove = new EventListener(ShapeEvent.MOVE, (event: ShapeEvent.MoveEvent) => {
        const { shape, destination, offset } = event.detail
        shape.position = add(destination, offset)
    })

    private readonly _handleResize = new EventListener(ShapeEvent.MOVE, (event: ShapeEvent.MoveEvent) => {
        if (this._state === undefined) {
            return
        }

        const {
            initialPolygonOrigin, initialPolygonOriginOffset, initialPolygonScale,
            initialActivePoint: K, initialFarthestPoint, initialHorizontalPoint: H, initialVerticalPoint: V
        } = this._state
        const { shape, destination: M } = event.detail
        const { abs, atan2, cos, acos, PI: π } = Math


        const ma = subtract(M, K),
            ab = subtract(H, K),
            ad = subtract(V, K)
        const α = acos(dot(normalize(ma), normalize(ab)))
        const β = acos(dot(normalize(ma), normalize(ad)))

        this._polygon.origin = initialPolygonOriginOffset

        const delta = multiply(initialPolygonScale, {
            x: ((-cos(α) * length(ma) + length(ab)) / length(ab)) - 1,
            y: ((-cos(β) * length(ma) + length(ad)) / length(ad)) - 1
        })

        if (delta.x === -Infinity) {
            delta.x = 0
        }

        if (delta.y === -Infinity) {
            delta.y = 0
        }

        this._polygon.scale = add(initialPolygonScale, delta)
        this._polygon.origin = initialPolygonOrigin
    })

    private readonly _handleResizeStart = new EventListener(ShapeEvent.MOVE_START, (event: ShapeEvent.MoveEvent) => {
        const { shape } = event.detail

        const previousPolygonDirection = this._polygon.direction
        this._polygon.direction = 0
        const origin = ap(divide(subtract(shape, this._polygon.a), this._polygon.dimension), x => -~-Math.round(x))
        this._polygon.direction = previousPolygonDirection

        const { a: A, ab: AB, b: B, bc: BC, c: C, cd: CD, d: D, da: DA } = this._points
        let H, V
         switch (shape) {
            case A:
                H = B
                V = D
                break
            case AB:
                H = AB
                V = CD
                break
            case B:
                H = A
                V = C
                break
            case BC:
                H = DA
                V = BC
                break
            case C:
                H = D
                V = B
                break
            case CD:
                H = CD
                V = AB
                break
            case D:
                H = C
                V = A
                break
            case DA:
                H = BC
                V = DA
                break
            default:
                throw new Error()
        }

        this._state = {
            initialHorizontalPoint: H.position,
            initialVerticalPoint: V.position,
            initialPolygonOrigin: this._polygon.origin,
            initialPolygonOriginOffset: origin,
            initialPolygonScale: this._polygon.scale,
            initialActivePoint: shape.position,
            initialFarthestPoint: this._polygon.points
                .reduce(
                    (farthest, next) =>
                        distance(shape, next) > distance(shape, farthest) ?
                            next : farthest
                ).position
        }
    })

    private readonly _handleResizeEnd = new EventListener(ShapeEvent.MOVE_END, (event: ShapeEvent.MoveEvent) => {
        // this._polygon.origin = this._state.initialPolygonOrigin
        delete this._state
    })
}



export default UnlockedScalingStrategy