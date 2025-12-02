import React from 'react';

export function useInitEffect( effectFn: React.EffectCallback, deps: React.DependencyList ) {
    const initRef = React.useRef( false );

    if( typeof deps?.length !== 'number' || deps.length < 1 ) {
        console.warn( 'useInitEffect: empty dependency array will have no effect' );
    }

    React.useEffect( () => {
        if( initRef.current === true ) {
            return effectFn();
        }

        initRef.current = true;
        return undefined;
    }, deps );
}
