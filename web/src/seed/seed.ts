import { DEFAULT_WORD_LISTS } from './defaultWordLists';
import { createWordList, getWordLists, upsertWordList } from '../storage/repo';

const SEEDED_KEY = 'spellvetica.seeded.v1';

export function seedDefaultsIfNeeded(): void {
  if (localStorage.getItem(SEEDED_KEY) === '1') return;
  if (getWordLists().length > 0) {
    localStorage.setItem(SEEDED_KEY, '1');
    return;
  }

  for (const list of DEFAULT_WORD_LISTS) {
    upsertWordList(createWordList(list));
  }
  localStorage.setItem(SEEDED_KEY, '1');
}

