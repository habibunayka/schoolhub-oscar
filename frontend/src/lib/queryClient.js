import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const CacheContext = createContext(null);

export function QueryProvider({ children }) {
  const cacheRef = useRef(new Map());
  return React.createElement(CacheContext.Provider, { value: cacheRef.current }, children);
}

export function useQuery(key, fetcher) {
  const cache = useContext(CacheContext);
  const [state, setState] = useState(() => {
    if (cache.has(key)) {
      return { data: cache.get(key), error: null, loading: false };
    }
    return { data: undefined, error: null, loading: true };
  });

  useEffect(() => {
    if (!cache.has(key)) {
      let cancelled = false;
      fetcher()
        .then((data) => {
          if (!cancelled) {
            cache.set(key, data);
            setState({ data, error: null, loading: false });
          }
        })
        .catch((err) => {
          if (!cancelled) setState({ data: undefined, error: err, loading: false });
        });
      return () => {
        cancelled = true;
      };
    }
  }, [key, fetcher, cache]);

  const invalidate = () => cache.delete(key);

  return { data: state.data, error: state.error, isLoading: state.loading, invalidate };
}
