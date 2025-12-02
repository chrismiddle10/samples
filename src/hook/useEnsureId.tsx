import React from 'react';

let prefix = 'samples';
let count = 0;

export function useEnsureId( propId?: string ): string {
    // track the automatically generated ID
    const autoId = React.useRef<string>();

    return React.useMemo( () => {
        // attempt to get a pre-defined ID
        let memoId = propId || autoId.current;

        // if a pre-defined ID is not available, generate a new one and track it
        if( typeof memoId !== 'string' || memoId.length <= 0 ) {
            memoId = autoId.current = `${prefix}-${++count}`;
        }

        return memoId;
    }, [propId] );
}
