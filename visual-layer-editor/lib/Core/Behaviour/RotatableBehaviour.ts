import { throttle } from "../common"
import Shape from "../Shape/Shape"



class RotatableBehaviour {
    private readonly _target: Shape
    private readonly _state = {
        initialized: null,
        active: false,
        cursor: ""
    }

    public static enabled = true

    constructor(target: Shape) {
        this._target = target
        this._state.initialized = requestAnimationFrame(() => {
            this._target.element.addEventListener("mousedown", this._onmousedown)
            document.addEventListener("mouseup", this._onmouseup)
            document.addEventListener("wheel", this._onscroll)
        })
    }

    public destroy(): void {
        if (this._state.initialized !== null) {
            cancelAnimationFrame(this._state.initialized)
        } else {
            this._target.element.removeEventListener("mousedown", this._onmousedown)
            document.removeEventListener("mouseup", this._onmouseup)
            document.removeEventListener("scroll", this._onscroll)
        }
    }

    private readonly _onmousedown = (event: MouseEvent): void => {
        event.preventDefault()
        if (RotatableBehaviour.enabled) {
            this._state.active = true
            this._target.element.classList.add("active")
        }
    }

    private readonly _onmouseup = (event: MouseEvent): void => {
        event.preventDefault()
        if (RotatableBehaviour.enabled) {
            this._state.active = false
            this._target.element.classList.remove("active")
        }
    }

    private readonly _onscroll = (event: WheelEvent) => {
        if (RotatableBehaviour.enabled) {
            const speed = 0.025
            this._target.direction += speed * Math.PI * Math.sign(event.deltaY)
            const rotationEl = document.querySelector(".rotation")
            rotationEl.textContent = `${(this._target.direction * (180 / Math.PI)).toFixed(2)}°`
        }
    }
}


export default RotatableBehaviour