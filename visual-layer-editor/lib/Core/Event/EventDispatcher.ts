export type Subscriber = (payload: unknown) => void


class EventDispatcher {
    private readonly _channels = new Map<string, Set<Subscriber>>()

    public on(event: string, subscriber: Subscriber) {
        const channel = this._channels.get(event)
        if (channel) {
            channel.add(subscriber)
        } else {
            const channel = new Set<Subscriber>()
                .add(subscriber)
            this._channels.set(event, channel)
        }
    }

    public off(event: string, subscriber: Subscriber) {
        const channel = this._channels.get(event)
        if (channel) {
            channel.delete(subscriber)
        }
    }

    public once(event: string, subscriber: Subscriber) {
        const once = (payload: unknown) => {
            subscriber(payload)
            this.off(event, once)
        }
        this.on(event, once)
    }

    public dispatch(event: string, payload: unknown) {
        const channel = this._channels.get(event)
        if (channel) {
            for (const subscriber of channel) {
                subscriber(payload)
            }
        }
    }
}



export default EventDispatcher