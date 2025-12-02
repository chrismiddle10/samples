import React from 'react';

let defaultTimeout = 500;

type AnyFn<T = any> = ( ...args: any[] ) => T;

export interface BufferedEffectOptions {
    handler: AnyFn;
    timeout?: number;
}

export function useBufferedEffect( options: BufferedEffectOptions | AnyFn, deps: React.DependencyList ) {
    const timeoutId = React.useRef<NodeJS.Timeout>();

    const asOptions = typeof options === 'function'
        ? { handler: options as AnyFn }
        : options as BufferedEffectOptions;

    const {
        handler,
        timeout = defaultTimeout,
    } = asOptions;

    React.useEffect( () => {
        clearTimeout( timeoutId.current );

        timeoutId.current = setTimeout( () => handler(), timeout );
        return () => {
            clearTimeout( timeoutId.current );
        };
    }, deps );
}
