export type Listener = (event: Event) => void


export enum EventType {
    MOUSE_MOVE = "mousemove",
    MOUSE_DOWN = "mousedown",
    MOUSE_UP = "mouseup"
}


class EventListener {
    private readonly _event: string
    private readonly _listener: Listener
    private readonly _targets = new Set<Element | Document>()

    constructor(event: string, listener: Listener) {
        this._event = event
        this._listener = listener
    }

    public subscribe(target: Element | Document): EventListener {
        target.addEventListener(this._event, this._listener)
        this._targets.add(target)
        return this
    }

    public destroy(): void {
        for (const target of this._targets) {
            target.removeEventListener(this._event, this._listener)
        }
    }
}



export default EventListener



/*

    private readonly _handleMoveStart = new EventListener("movestart", (event) => {

    })


    this._handleMoveStart.target(document.body)

 */