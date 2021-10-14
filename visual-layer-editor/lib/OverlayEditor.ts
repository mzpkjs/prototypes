import RotatableBehaviour from "./Core/Behaviour/RotatableBehaviour"
import Vector from "./Core/Math/Vector"
import Point from "./Core/Shape/Point"
import Polygon from "./Core/Shape/Polygon"
import FreePolygonStrategy from "./Strategy/FreePolygonStrategy"
import LockedScalingStrategy from "./Strategy/LockedScalingStrategy"
import UnlockedScalingStrategy from "./Strategy/UnlockedScalingStrategy"
import ImageSubject from "./Subject/ImageSubject"



class OverlayEditor {
    private readonly _subject: ImageSubject
    private readonly _polygon: Polygon
    private readonly _points: Record<keyof { a, ab, b, bc, c, cd, d, da }, Point>

    constructor(canvas: HTMLElement, subject: ImageSubject) {
        this._subject = subject
        const a = new Point(0, 0),
            ab = new Point(160, 0),
            b = new Point(320, 0),
            bc = new Point(320, 120),
            c = new Point(320, 240),
            cd = new Point(160, 240),
            d = new Point(0, 240),
            da = new Point(0, 120)
        this._polygon = new Polygon(a, ab, b, bc, c, cd, d, da)
        this._points = { a, ab, b, bc, c, cd, d, da }

        this._subject.strategy = new LockedScalingStrategy(canvas, this._polygon, this._points)
        const modeEl: HTMLElement = document.querySelector(".mode")
        let debunked = false
        window.addEventListener("keypress", (event) => {
            const { key } = event
            if (!debunked) {
                switch (key) {
                    case "1":
                        subject.strategy.destroy()
                        subject.strategy = new LockedScalingStrategy(canvas, this._polygon, this._points)
                        modeEl.textContent = "Locked Scaling"
                        break
                    case "2":
                        subject.strategy.destroy()
                        subject.strategy = new UnlockedScalingStrategy(canvas, this._polygon, this._points)
                        modeEl.textContent = "Unlocked Scaling"
                        break
                    case "3":
                        // RotatableBehaviour.enabled = false
                        debunked = true
                        subject.strategy.destroy()
                        subject.strategy = new FreePolygonStrategy(canvas, this._polygon, this._points)
                        modeEl.textContent = "Polygon (LOCKED)"
                        modeEl.style.color = "lightcoral"
                        modeEl.style.fontWeight = "bold"
                        break
                }
            }
        })

        const projection = document.createElement("div")
        projection.className = "preview projection"
        projection.style.position = "relative"
        projection.style.width = "100%"
        projection.style.height = "100%"
        projection.style.overflow = "hidden"

        // this._polygon.origin = {  x: 1, y: 1 }
        let n = 1
        const tick = () => {
            this._polygon.draw()
            this._subject.draw(projection, this._polygon, this._points)
            // this._polygon.scale = { x: n, y: 1 }
            if (n < 2) {
                n += 0.0025
            }
            requestAnimationFrame(tick)
        }

        this._polygon.prepare(canvas)
        this._subject.prepare(projection, this._polygon, this._points)
        requestAnimationFrame(tick)

        canvas.append(projection)
    }

    public destroy(): void {

    }
}



export default OverlayEditor