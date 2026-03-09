import './App.css';
import { useEffect } from 'react';
import { initStorage } from './storage/init';
import { seedDefaultsIfNeeded } from './seed/seed';
import { useNavigation } from './ui/useNavigation';
import { AdminHome } from './screens/AdminHome';
import { ImportWordList } from './screens/ImportWordList';
import { TestScreen } from './screens/TestScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { HistoryDetailScreen } from './screens/HistoryDetailScreen';

function App() {
  const nav = useNavigation({ name: 'admin' });

  useEffect(() => {
    initStorage();
    seedDefaultsIfNeeded();
  }, []);

  switch (nav.route.name) {
    case 'admin':
      return <AdminHome nav={nav} />;
    case 'import':
      return <ImportWordList nav={nav} />;
    case 'test':
      return <TestScreen nav={nav} />;
    case 'results':
      return <ResultsScreen nav={nav} historyEntryId={nav.route.historyEntryId} />;
    case 'history':
      return <HistoryScreen nav={nav} />;
    case 'historyDetail':
      return <HistoryDetailScreen nav={nav} historyEntryId={nav.route.historyEntryId} />;
  }
}

export default App;
