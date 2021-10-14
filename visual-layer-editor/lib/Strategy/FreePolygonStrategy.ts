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


class FreePolygonStrategy {
    private readonly _canvas: HTMLElement
    private readonly _polygon: Polygon
    private readonly _points: Record<keyof { a; b; c; d }, Point>

    constructor(canvas: HTMLElement, polygon: Polygon, points: Record<keyof { a, b, c, d }, Point>) {
        this._canvas = canvas
        this._polygon = polygon
        this._points = points

        this._handleMove
            .subscribe(this._polygon.element)
        for (const point of this._polygon.points) {
            this._handleResize
                .subscribe(point.element)
        }
    }

    public destroy(): void {
        this._handleMove
            .destroy()
        this._handleResize
            .destroy()
    }

    private readonly _handleMove = new EventListener(ShapeEvent.MOVE, (event: ShapeEvent.MoveEvent) => {
        const { shape, destination, offset } = event.detail
        shape.position = add(destination, offset)
    })

    private readonly _handleResize = new EventListener(ShapeEvent.MOVE, (event: ShapeEvent.MoveEvent) => {
        const { shape, destination } = event.detail
        console.log(shape)
        shape.position = destination
    })
}



export default FreePolygonStrategy