import React, { useMemo, useState } from 'react';
import { parseWordListText } from '../domain/parsing';
import { createWordList, upsertWordList } from '../storage/repo';
import type { Navigation } from '../ui/Route';
import { Layout } from './components/Layout';

const MAX_WORDS = 50;

export function ImportWordList(props: { nav: Navigation }) {
  const [fileName, setFileName] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const words = useMemo(() => parseWordListText(rawText, MAX_WORDS), [rawText]);

  return (
    <Layout
      title="Import list"
      right={
        <button className="sv-button sv-buttonGhost" onClick={() => props.nav.goBack()}>
          Back
        </button>
      }
    >
      <section className="sv-card">
        <h2 className="sv-h2">Choose a TXT file</h2>
        <input
          className="sv-input"
          type="file"
          accept=".txt,text/plain"
          onChange={async (e) => {
            setError(null);
            const file = e.target.files?.[0];
            if (!file) return;
            setFileName(file.name);
            const text = await file.text();
            setRawText(text);
            if (!name) {
              const base = file.name.replace(/\.txt$/i, '');
              setName(base || 'New list');
            }
          }}
        />
        <div className="sv-spacer" />

        <label className="sv-label">
          List name
          <input className="sv-input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <div className="sv-spacer" />
        <div className="sv-row sv-rowWrap">
          <div className="sv-pill">{fileName ? `File: ${fileName}` : 'No file selected'}</div>
          <div className="sv-pill">{words.length} / {MAX_WORDS} words</div>
        </div>

        {error ? <div className="sv-error">{error}</div> : null}

        <div className="sv-spacer" />
        <button
          className="sv-button"
          onClick={() => {
            setError(null);
            const cleanName = name.trim();
            if (!cleanName) {
              setError('Please enter a list name.');
              return;
            }
            if (words.length === 0) {
              setError('No words found. Make sure your file has one word per line.');
              return;
            }
            const list = createWordList({ name: cleanName, words });
            upsertWordList(list);
            props.nav.reset({ name: 'admin' });
          }}
        >
          Save list
        </button>
      </section>

      <section className="sv-card">
        <h2 className="sv-h2">Preview</h2>
        {words.length === 0 ? <p className="sv-muted">Words will show here.</p> : null}
        <ol className="sv-preview">
          {words.map((w, i) => (
            <li key={`${w}-${i}`} className="sv-previewItem">
              {w}
            </li>
          ))}
        </ol>
      </section>
    </Layout>
  );
}

