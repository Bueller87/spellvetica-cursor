import React, { useMemo } from 'react';
import { gradeAnswer } from '../domain/grading';
import { getHistoryEntry } from '../storage/repo';
import type { Navigation } from '../ui/Route';
import { Layout } from './components/Layout';

export function ResultsScreen(props: { nav: Navigation; historyEntryId: string }) {
  const entry = useMemo(() => getHistoryEntry(props.historyEntryId), [props.historyEntryId]);

  if (!entry) {
    return (
      <Layout
        title="Results"
        right={
          <button className="sv-button sv-buttonGhost" onClick={() => props.nav.reset({ name: 'admin' })}>
            Home
          </button>
        }
      >
        <section className="sv-card">
          <p className="sv-muted">Results not found.</p>
        </section>
      </Layout>
    );
  }

  const graded = entry.words.map((w, i) => ({
    word: w,
    typed: entry.answers[i],
    isCorrect: gradeAnswer(w, entry.answers[i]).isCorrect,
  }));

  return (
    <Layout
      title="Results"
      right={
        <button className="sv-button sv-buttonGhost" onClick={() => props.nav.reset({ name: 'admin' })}>
          Home
        </button>
      }
    >
      <section className="sv-card sv-cardBig">
        <h2 className="sv-h2">Score</h2>
        <div className="sv-score">
          {entry.correctCount} / {entry.totalCount}
        </div>
        <div className="sv-muted">List: {entry.wordListName}</div>
      </section>

      <section className="sv-card">
        <h2 className="sv-h2">Missed words</h2>
        {entry.missedWords.length === 0 ? <p className="sv-muted">Perfect score!</p> : null}
        <ul className="sv-chips">
          {entry.missedWords.map((w, i) => (
            <li key={`${w}-${i}`} className="sv-chip sv-chipBad">
              {w}
            </li>
          ))}
        </ul>
      </section>

      <section className="sv-card">
        <h2 className="sv-h2">All answers</h2>
        <div className="sv-table">
          {graded.map((row, i) => (
            <div key={`${row.word}-${i}`} className="sv-tableRow">
              <div className="sv-tableCell sv-word">{row.word}</div>
              <div className="sv-tableCell sv-answer">{row.typed ?? <span className="sv-muted">—</span>}</div>
              <div className="sv-tableCell sv-result">
                <span className={row.isCorrect ? 'sv-badge sv-badgeGood' : 'sv-badge sv-badgeBad'}>
                  {row.isCorrect ? 'Correct' : 'Missed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sv-card">
        <button className="sv-button sv-buttonSecondary" onClick={() => props.nav.reset({ name: 'history' })}>
          View history
        </button>
      </section>
    </Layout>
  );
}

