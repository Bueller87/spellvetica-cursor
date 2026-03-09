import type { TestSession } from '../domain/types';

export type Route =
  | { name: 'admin' }
  | { name: 'import' }
  | { name: 'test' }
  | { name: 'results'; historyEntryId: string }
  | { name: 'history' }
  | { name: 'historyDetail'; historyEntryId: string };

export type Navigation = {
  route: Route;
  go: (route: Route) => void;
  goBack: () => void;
  reset: (route: Route) => void;
};

export function shouldAutoResume(route: Route, session: TestSession | null): boolean {
  return route.name === 'admin' && session != null;
}

