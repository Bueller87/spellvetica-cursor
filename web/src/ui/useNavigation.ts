import { useCallback, useMemo, useState } from 'react';
import type { Navigation, Route } from './Route';

export function useNavigation(initial: Route): Navigation {
  const [stack, setStack] = useState<Route[]>([initial]);

  const route = stack[stack.length - 1] ?? initial;

  const go = useCallback((next: Route) => {
    setStack((prev) => [...prev, next]);
  }, []);

  const reset = useCallback((next: Route) => {
    setStack([next]);
  }, []);

  const goBack = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  return useMemo(() => ({ route, go, goBack, reset }), [go, goBack, reset, route]);
}

