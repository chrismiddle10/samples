import React from 'react';

const DEFAULT_TIMEOUT = 500;

export interface BufferedEffectOptions {
    /**
     * This is simply the function one might otherwise pass to {React.useEffect}
     */
    handler: React.EffectCallback;

    /**
     * This is how long the execution of {BufferedEffectOptions#handler} should be delayed in the event that the hook dependencies change.
     */
    timeout?: number;
}

/**
 * {useBufferedEffect} fires after a specified timeout.
 */
export function useBufferedEffect( options: BufferedEffectOptions | React.EffectCallback, deps: React.DependencyList ) {
    const timeoutId = React.useRef<NodeJS.Timeout>();

    // this ensures that we are using a {BufferedEffectOptions} object before attempting to deconstruct the provided {options} argument.
    // {options} is not exhaustively validated here {handler} and {timeout} could potentially not be of the expected types
    const asOptions = typeof options === 'function'
        ? { handler: options as React.EffectCallback }
        : options as BufferedEffectOptions;

    const {
        handler,
        timeout = DEFAULT_TIMEOUT,
    } = asOptions;

    React.useEffect( () => {
        // if dependencies change, clear the timeout without further consideration
        clearTimeout( timeoutId.current );

        // create a new timeout with the provided handler as the target
        timeoutId.current = setTimeout( handler, timeout );

        return () => {
            // if cleanup occurs, clear the timeout
            clearTimeout( timeoutId.current );
        };
    }, deps );
}

/**
 * example usages
 */
useBufferedEffect( () => {
    // your effect
}, [dep1, dep2] );

useBufferedEffect( {
    timeout: 60_000,
    handler() {
        // your effect
    }
}, [dep1, dep2] );
