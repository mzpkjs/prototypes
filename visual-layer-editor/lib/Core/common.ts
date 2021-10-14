export const debounce = <TFunction extends Function>(
    debounced: TFunction,
    wait: number = 0,
    options = { maxWait: Infinity }
): TFunction => {
    const state = {
        token: null as null | NodeJS.Timeout,
        returnValue: null as null | unknown,
    }

    const inner = (...varargs: unknown[]): unknown => {
        inner.cancel()

        if (state.returnValue === null) {
            state.returnValue = debounced(...varargs)
            if (options.maxWait !== Infinity) {
                setTimeout(() => {
                    state.returnValue = null
                }, options.maxWait)
            }
        }

        state.token = setTimeout(() => {
            state.token = null
            state.returnValue = null
        }, wait)

        return state.returnValue
    }

    inner.cancel = () => {
        if (state.token) {
            clearTimeout(state.token)
        }
    }

    return inner as unknown as TFunction
}


export const throttle = <TFunction extends Function>(
    throttled: TFunction,
    wait: number = 0
): TFunction => {
    return debounce(throttled, wait, { maxWait: wait })
}


export const groupBy = <TValue>(by: (value: TValue) => unknown, array: TValue[]) => {
    return array.reduce((accumulator, value) => {
        const key = String(by(value))
        if (key in accumulator) {
            accumulator[key].push(value)
        } else {
            accumulator[key] = [ value ]
        }

        return accumulator
    }, {} as Record<string, TValue[]>)
}