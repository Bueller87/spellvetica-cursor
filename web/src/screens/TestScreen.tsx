import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gradeAnswer } from '../domain/grading';
import type { TestSession } from '../domain/types';
import { nowIso } from '../domain/ids';
import { addHistoryEntry, clearActiveSession, createHistoryEntry, getActiveSession, saveActiveSession } from '../storage/repo';
import { SpeechSynthesisPronouncer } from '../services/pronounce/SpeechSynthesisPronouncer';
import { NullSentenceProvider } from '../services/sentences/NullSentenceProvider';
import type { Navigation } from '../ui/Route';
import { Layout } from './components/Layout';

const pronouncer = new SpeechSynthesisPronouncer();
const sentenceProvider = new NullSentenceProvider();

export function TestScreen(props: { nav: Navigation }) {
  const [session, setSession] = useState<TestSession | null>(() => getActiveSession());
  const [input, setInput] = useState('');
  const [sentence, setSentence] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentWord = session ? session.words[session.currentIndex] ?? '' : '';
  const progressText = session ? `Word ${session.currentIndex + 1} of ${session.words.length}` : '';

  const answeredCount = useMemo(() => {
    if (!session) return 0;
    return session.answers.filter((a) => a != null).length;
  }, [session]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [session?.currentIndex]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!session) return;
      const s = await sentenceProvider.getSentence(currentWord);
      if (!cancelled) setSentence(s);
    })();
    return () => {
      cancelled = true;
    };
  }, [currentWord, session]);

  useEffect(() => {
    if (!session) return;
    saveActiveSession({ ...session, updatedAt: nowIso() });
  }, [session]);

  if (!session) {
    return (
      <Layout
        title="Test"
        right={
          <button className="sv-button sv-buttonGhost" onClick={() => props.nav.reset({ name: 'admin' })}>
            Home
          </button>
        }
      >
        <section className="sv-card">
          <p className="sv-muted">No active test. Start one from the home screen.</p>
          <button className="sv-button" onClick={() => props.nav.reset({ name: 'admin' })}>
            Go to home
          </button>
        </section>
      </Layout>
    );
  }

  const setAnswerAt = (idx: number, value: string | null, markSkipped: boolean) => {
    setSession((prev) => {
      if (!prev) return prev;
      const answers = prev.answers.slice();
      answers[idx] = value;
      const skippedSet = new Set(prev.skippedWordIndexes);
      if (markSkipped) skippedSet.add(idx);
      return {
        ...prev,
        answers,
        skippedWordIndexes: Array.from(skippedSet).sort((a, b) => a - b),
      };
    });
  };

  const goToIndex = (idx: number) => {
    setSession((prev) => (prev ? { ...prev, currentIndex: Math.max(0, Math.min(prev.words.length - 1, idx)) } : prev));
    setInput((prev) => {
      const existing = session?.answers[idx];
      return typeof existing === 'string' ? existing : '';
    });
  };

  const findFirstUnanswered = (): number | null => {
    const i = session.answers.findIndex((a) => a == null);
    return i === -1 ? null : i;
  };

  const finishIfDone = () => {
    const firstUnanswered = findFirstUnanswered();
    if (firstUnanswered != null) {
      goToIndex(firstUnanswered);
      return;
    }

    const results = session.words.map((w, i) => gradeAnswer(w, session.answers[i]));
    const correctCount = results.filter((r) => r.isCorrect).length;
    const missedWords = session.words.filter((w, i) => !results[i]?.isCorrect);

    const entry = createHistoryEntry({ session, correctCount, missedWords });
    addHistoryEntry(entry);
    clearActiveSession();
    props.nav.reset({ name: 'results', historyEntryId: entry.id });
  };

  const submit = () => {
    const trimmed = input.trim();
    if (trimmed.length === 0) {
      // Treat blank submit as a skip to keep it unanswered.
      setAnswerAt(session.currentIndex, null, true);
    } else {
      setAnswerAt(session.currentIndex, input, false);
    }

    const nextIndex = Math.min(session.currentIndex + 1, session.words.length - 1);
    if (session.currentIndex === session.words.length - 1) {
      finishIfDone();
      return;
    }
    goToIndex(nextIndex);
    setInput('');
  };

  const skip = () => {
    setAnswerAt(session.currentIndex, null, true);
    const nextIndex = Math.min(session.currentIndex + 1, session.words.length - 1);
    if (session.currentIndex === session.words.length - 1) {
      finishIfDone();
      return;
    }
    goToIndex(nextIndex);
    setInput('');
  };

  const back = () => {
    const prevIndex = Math.max(0, session.currentIndex - 1);
    goToIndex(prevIndex);
    const existing = session.answers[prevIndex];
    setInput(typeof existing === 'string' ? existing : '');
  };

  const hearWord = async () => {
    await pronouncer.speak(currentWord);
  };

  return (
    <Layout
      title="Spelling test"
      right={
        <button
          className="sv-button sv-buttonGhost"
          onClick={() => {
            if (!window.confirm('Exit to home? Your progress will be saved.')) return;
            pronouncer.cancel();
            props.nav.reset({ name: 'admin' });
          }}
        >
          Home
        </button>
      }
    >
      <section className="sv-card sv-cardBig">
        <div className="sv-row sv-rowSpace">
          <div className="sv-muted">{progressText}</div>
          <div className="sv-muted">{answeredCount} answered</div>
        </div>

        <div className="sv-spacerLg" />

        <button
          className="sv-button sv-buttonPrimary sv-buttonLarge"
          onClick={hearWord}
          disabled={!pronouncer.isSupported()}
        >
          Hear word
        </button>

        {!pronouncer.isSupported() ? (
          <div className="sv-muted sv-small">Audio isn’t available in this browser.</div>
        ) : null}

        {sentence ? <div className="sv-sentence">{sentence}</div> : null}

        <div className="sv-spacerLg" />

        <input
          ref={inputRef}
          className="sv-input sv-inputLarge"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
          placeholder="Type the word"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        <div className="sv-spacer" />
        <div className="sv-row sv-rowSpace sv-rowWrap">
          <button className="sv-button sv-buttonSecondary" onClick={back} disabled={session.currentIndex === 0}>
            Back
          </button>
          <div className="sv-row">
            <button className="sv-button sv-buttonGhost" onClick={skip}>
              Skip
            </button>
            <button className="sv-button" onClick={submit}>
              Next
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

