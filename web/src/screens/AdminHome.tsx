import React, { useMemo, useState } from 'react';
import type { WordList } from '../domain/types';
import { getActiveSession, getWordLists, startSessionFromWordList, deleteWordList, saveActiveSession } from '../storage/repo';
import type { Navigation } from '../ui/Route';
import { Layout } from './components/Layout';

export function AdminHome(props: { nav: Navigation }) {
  const [refresh, setRefresh] = useState(0);

  const { lists, activeSession } = useMemo(() => {
    void refresh;
    return { lists: getWordLists(), activeSession: getActiveSession() };
  }, [refresh]);

  return (
    <Layout
      title="Spellvetica"
      right={
        <button className="sv-button sv-buttonGhost" onClick={() => props.nav.go({ name: 'history' })}>
          History
        </button>
      }
    >
      <section className="sv-card">
        <h2 className="sv-h2">Adult setup</h2>
        <div className="sv-row">
          <button className="sv-button" onClick={() => props.nav.go({ name: 'import' })}>
            Import TXT word list
          </button>
          {activeSession ? (
            <button className="sv-button sv-buttonSecondary" onClick={() => props.nav.go({ name: 'test' })}>
              Resume test
            </button>
          ) : null}
        </div>
      </section>

      <section className="sv-card">
        <h2 className="sv-h2">Saved word lists</h2>
        {lists.length === 0 ? <p className="sv-muted">No lists yet. Import one to begin.</p> : null}
        <ul className="sv-list">
          {lists.map((l) => (
            <WordListRow
              key={l.id}
              list={l}
              onStart={() => {
                const session = startSessionFromWordList(l);
                saveActiveSession(session);
                props.nav.go({ name: 'test' });
              }}
              onDelete={() => {
                if (!window.confirm(`Delete "${l.name}"?`)) return;
                deleteWordList(l.id);
                setRefresh((x) => x + 1);
              }}
            />
          ))}
        </ul>
      </section>
    </Layout>
  );
}

function WordListRow(props: {
  list: WordList;
  onStart: () => void;
  onDelete: () => void;
}) {
  return (
    <li className="sv-listItem">
      <div className="sv-listMain">
        <div className="sv-listTitle">{props.list.name}</div>
        <div className="sv-listMeta">{props.list.words.length} words</div>
      </div>
      <div className="sv-row">
        <button className="sv-button sv-buttonSmall" onClick={props.onStart}>
          Start
        </button>
        <button className="sv-button sv-buttonSmall sv-buttonDanger" onClick={props.onDelete}>
          Delete
        </button>
      </div>
    </li>
  );
}

