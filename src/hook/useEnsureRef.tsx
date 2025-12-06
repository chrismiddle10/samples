import React from 'react';

/**
 * {useEnsureRef} is a simple but useful hook for ensuring that we have a ref when being used within a component
 * that needs one and also uses {React.forwardRef}; i.e. the parent component may have already provided a ref.
 */
export function useEnsureRef<T>( forwarded?: React.ForwardedRef<T> ): React.MutableRefObject<T> {
  const newRef = React.useRef<T>( null );

  return ( forwarded ?? newRef ) as React.MutableRefObject<T>;
}
