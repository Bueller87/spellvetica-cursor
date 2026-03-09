import { makeId, nowIso } from '../domain/ids';
import type { TestHistoryEntry, TestSession, WordList } from '../domain/types';
import { STORAGE_KEYS } from './keys';
import { readJson, writeJson } from './localStorageJson';

function readArray<T>(key: string): T[] {
  const value = readJson<unknown>(key);
  return Array.isArray(value) ? (value as T[]) : [];
}

export function getWordLists(): WordList[] {
  return readArray<WordList>(STORAGE_KEYS.wordLists);
}

export function getWordList(id: string): WordList | null {
  return getWordLists().find((l) => l.id === id) ?? null;
}

export function upsertWordList(list: WordList): void {
  const lists = getWordLists();
  const idx = lists.findIndex((l) => l.id === list.id);
  const next = [...lists];
  if (idx >= 0) next[idx] = list;
  else next.unshift(list);
  writeJson(STORAGE_KEYS.wordLists, next);
}

export function deleteWordList(id: string): void {
  const next = getWordLists().filter((l) => l.id !== id);
  writeJson(STORAGE_KEYS.wordLists, next);
}

export function createWordList(input: { name: string; words: string[] }): WordList {
  return {
    id: makeId(),
    name: input.name,
    words: input.words,
    createdAt: nowIso(),
  };
}

export function getActiveSession(): TestSession | null {
  const session = readJson<TestSession>(STORAGE_KEYS.activeSession);
  if (session == null) return null;
  if (!Array.isArray(session.words) || !Array.isArray(session.answers)) return null;
  return session;
}

export function saveActiveSession(session: TestSession): void {
  writeJson(STORAGE_KEYS.activeSession, session);
}

export function clearActiveSession(): void {
  localStorage.removeItem(STORAGE_KEYS.activeSession);
}

export function startSessionFromWordList(list: WordList): TestSession {
  const words = list.words.slice();
  return {
    id: makeId(),
    wordListId: list.id,
    wordListName: list.name,
    words,
    currentIndex: 0,
    answers: words.map(() => null),
    skippedWordIndexes: [],
    startedAt: nowIso(),
    updatedAt: nowIso(),
  };
}

export function getHistory(): TestHistoryEntry[] {
  return readArray<TestHistoryEntry>(STORAGE_KEYS.history);
}

export function getHistoryEntry(id: string): TestHistoryEntry | null {
  return getHistory().find((h) => h.id === id) ?? null;
}

export function addHistoryEntry(entry: TestHistoryEntry): void {
  const history = getHistory();
  const next = [entry, ...history];
  writeJson(STORAGE_KEYS.history, next);
}

export function createHistoryEntry(input: {
  session: TestSession;
  correctCount: number;
  missedWords: string[];
}): TestHistoryEntry {
  return {
    id: makeId(),
    wordListId: input.session.wordListId,
    wordListName: input.session.wordListName,
    date: nowIso(),
    words: input.session.words.slice(),
    answers: input.session.answers.slice(),
    correctCount: input.correctCount,
    totalCount: input.session.words.length,
    missedWords: input.missedWords.slice(),
  };
}

