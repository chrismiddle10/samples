import React from 'react';

let defaultInterval = 60_000; // one minute

type AnyFn<T = any> = ( ...args: any[] ) => T;

export interface IntervalEffectOptions {
    handler: AnyFn;
    interval?: number;
}

export function useIntervalEffect( options: IntervalEffectOptions | AnyFn, deps: React.DependencyList ) {
    const intervalId = React.useRef<NodeJS.Timeout>();

    const asOptions = typeof options === 'function'
        ? { handler: options as AnyFn }
        : options as IntervalEffectOptions;

    const {
        handler,
        interval = defaultInterval,
    } = asOptions;

    React.useEffect( () => {
        clearInterval( intervalId.current );

        intervalId.current = setInterval( () => handler(), interval );
        return () => {
            clearInterval( intervalId.current );
        };
    }, deps );
}
