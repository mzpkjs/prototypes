import Matrix, { rotate, translate } from "../Core/Math/Matrix"
import { distance } from "../Core/Math/Vector"
import Point from "../Core/Shape/Point"
import Polygon from "../Core/Shape/Polygon"
import FreePolygonStrategy from "../Strategy/FreePolygonStrategy"
import LockedScalingStrategy from "../Strategy/LockedScalingStrategy"
import UnlockedScalingStrategy from "../Strategy/UnlockedScalingStrategy"



class ImageSubject {
    private readonly _element: HTMLElement
    private _transform: Matrix = Matrix.identity()
    private _strategy?: LockedScalingStrategy | UnlockedScalingStrategy | FreePolygonStrategy

    constructor() {
        this._element = document.createElement("div")
        this._element.className = "subject image"
        this._element.style.position = "absolute"
        this._element.style.pointerEvents = "none"
        this._element.style.backgroundImage = "url(\"https://media.giphy.com/media/koUtwnvA3TY7C/giphy.gif\")"
        this._element.style.backgroundSize = `calc(100% - 6px) calc(100% - 6px)`
        this._element.style.backgroundRepeat = `no-repeat`
        this._element.style.backgroundPosition = `center`
    }

    public prepare(canvas: HTMLElement, polygon: Polygon, points: Record<keyof { a, b, c, d }, Point>) {
        canvas.append(this._element)
        // this._strategy.prepare(canvas, polygon, points)
    }

    public draw(canvas: HTMLElement, polygon: Polygon, points: Record<keyof { a, b, c, d }, Point>): void {
        const width = distance(points.a, points.b),
            height = distance(points.a, points.d)

        this._element.style.width = `${width}px`
        this._element.style.height = `${height}px`

        this._transform = translate(this._transform, -width * polygon.origin.x, -height * polygon.origin.y)
        this._transform = rotate(this._transform, polygon.direction)

        const { a, b, c, d, tx, ty } = this._transform
        this._element.style.transformOrigin = `${polygon.origin.x * 100}% ${polygon.origin.y * 100}%`
        this._element.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${polygon.x + tx}, ${polygon.y + ty})`

        canvas.style.clipPath = `polygon(${
            polygon.points
                .map(point => `${point.x}px ${point.y}px`)
        })`
    }

    public get strategy() {
        return this._strategy
    }

    public set strategy(value: LockedScalingStrategy | UnlockedScalingStrategy | FreePolygonStrategy) {
        this._strategy = value
    }
}



export default ImageSubject