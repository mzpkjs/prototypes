import Shape from "../Shape/Shape"



class MovableBehaviour {
    private readonly _target: Shape
    private readonly _state = {
        initialized: null,
        active: false,
        origin: { x: 0, y: 0 }
    }

    constructor(target: Shape) {
        this._target = target
        this._state.initialized = requestAnimationFrame(() => {
            this._target.element.addEventListener("mousedown", this._onmousedown)
            document.addEventListener("mouseup", this._onmouseup)
            document.addEventListener("mousemove", this._onmousemove)
        })
    }

    public destroy(): void {
        if (this._state.initialized !== null) {
            cancelAnimationFrame(this._state.initialized)
        } else {
            this._target.element.removeEventListener("mousedown", this._onmousedown)
            document.removeEventListener("mouseup", this._onmouseup)
            document.removeEventListener("mousemove", this._onmousemove)
        }
    }

    private readonly _onmousedown = (event: MouseEvent): void => {
        event.preventDefault()
        const canvas = this._target.element.parentElement
        this._state.origin.x = event.pageX - canvas.offsetLeft - this._target.ax
        this._state.origin.y = event.pageY - canvas.offsetTop - this._target.ay
        this._state.active = true
        this._target.element.classList.add("active")
    }

    private readonly _onmouseup = (event: MouseEvent): void => {
        event.preventDefault()
        this._state.active = false
        this._target.element.classList.remove("active")
    }

    private readonly _onmousemove = (event: MouseEvent): void => {
        event.preventDefault()
        if (this._state.active) {
            const canvas = this._target.element.parentElement
            this._target.x = event.pageX - canvas.offsetLeft + this._target.width * this._target.origin.x - this._state.origin.x
            this._target.y = event.pageY - canvas.offsetTop + this._target.height * this._target.origin.y - this._state.origin.y
        }
    }
}


export default MovableBehaviour