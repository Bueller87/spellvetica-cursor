import React from 'react';
import type { Navigation } from '../ui/Route';
import { ResultsScreen } from './ResultsScreen';

export function HistoryDetailScreen(props: { nav: Navigation; historyEntryId: string }) {
  return <ResultsScreen nav={props.nav} historyEntryId={props.historyEntryId} />;
}

