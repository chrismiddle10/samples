import React from 'react';

const DEFAULT_INTERVAL = 60_000; // one minute

export interface IntervalEffectOptions {
    handler: React.EffectCallback;
    interval?: number;
}

/**
 * {useIntervalEffect} is identical to {useBufferedEffect} in every way except for internally it calls {setInterval} rather than {setTimeout}.
 */
export function useIntervalEffect( options: IntervalEffectOptions | React.EffectCallback, deps: React.DependencyList ) {
    const intervalId = React.useRef<NodeJS.Timeout>();

    const asOptions = typeof options === 'function'
        ? { handler: options as React.EffectCallback }
        : options as IntervalEffectOptions;

    const {
        handler,
        interval = DEFAULT_INTERVAL,
    } = asOptions;

    React.useEffect( () => {
        clearInterval( intervalId.current );

        intervalId.current = setInterval( handler, interval );
        return () => {
            clearInterval( intervalId.current );
        };
    }, deps );
}
