import React, { useMemo, useState } from 'react';
import { getHistory } from '../storage/repo';
import type { Navigation } from '../ui/Route';
import { Layout } from './components/Layout';

export function HistoryScreen(props: { nav: Navigation }) {
  const [refresh, setRefresh] = useState(0);
  const history = useMemo(() => {
    void refresh;
    return getHistory();
  }, [refresh]);

  return (
    <Layout
      title="History"
      right={
        <button className="sv-button sv-buttonGhost" onClick={() => props.nav.goBack()}>
          Back
        </button>
      }
    >
      <section className="sv-card">
        {history.length === 0 ? <p className="sv-muted">No tests yet.</p> : null}
        <ul className="sv-list">
          {history.map((h) => (
            <li key={h.id} className="sv-listItem">
              <div className="sv-listMain">
                <div className="sv-listTitle">{h.wordListName}</div>
                <div className="sv-listMeta">
                  {new Date(h.date).toLocaleString()} • {h.correctCount}/{h.totalCount}
                </div>
              </div>
              <button
                className="sv-button sv-buttonSmall"
                onClick={() => props.nav.go({ name: 'historyDetail', historyEntryId: h.id })}
              >
                View
              </button>
            </li>
          ))}
        </ul>

        <div className="sv-spacer" />
        <button className="sv-button sv-buttonGhost" onClick={() => setRefresh((x) => x + 1)}>
          Refresh
        </button>
      </section>
    </Layout>
  );
}

