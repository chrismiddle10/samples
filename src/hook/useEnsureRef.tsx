import React from 'react';

export function useEnsureRef<T>( forwarded?: React.ForwardedRef<T> ): React.MutableRefObject<T> {
  const newRef = React.useRef<T>( null );

  return ( forwarded ?? newRef ) as React.MutableRefObject<T>;
}
