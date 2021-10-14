import EventListener from "../Core/Event/EventListener"
import Vector, { add, ap, distance, divide, scale, subtract } from "../Core/Math/Vector"
import Point from "../Core/Shape/Point"
import Polygon from "../Core/Shape/Polygon"
import { ShapeEvent } from "../Core/Shape/Shape"



type State = {
    initialPolygonOrigin: Vector,
    initialPolygonOriginOffset: Vector,
    initialPolygonScale: Vector
    initialActivePoint: Vector,
    initialFarthestPoint: Vector,
}


class LockedScalingStrategy {
    private readonly _canvas: HTMLElement
    private readonly _polygon: Polygon
    private readonly _points: Record<keyof { a; b; c; d }, Point>
    private _state?: State

    constructor(canvas: HTMLElement, polygon: Polygon, points: Record<keyof { a, b, c, d }, Point>) {
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
            initialActivePoint, initialFarthestPoint
        } = this._state
        const { destination } = event.detail
        const longer = distance(destination, initialFarthestPoint),
            shorter = distance(initialActivePoint, initialFarthestPoint)
        const delta = scale(initialPolygonScale, longer / shorter - 1)
        this._polygon.origin = initialPolygonOriginOffset
        this._polygon.scale = add(delta, initialPolygonScale)
        this._polygon.origin = initialPolygonOrigin
    })

    private readonly _handleResizeStart = new EventListener(ShapeEvent.MOVE_START, (event: ShapeEvent.MoveEvent) => {
        const { shape } = event.detail
        this._state = {
            initialPolygonOrigin: this._polygon.origin,
            initialPolygonOriginOffset: ap(divide(subtract(shape, this._polygon.a), this._polygon.dimension), x => -~-Math.round(x)),
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
        this._polygon.origin = this._state.initialPolygonOrigin
        delete this._state
    })
}



export default LockedScalingStrategy