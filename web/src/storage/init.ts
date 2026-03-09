import { SCHEMA_VERSION, STORAGE_KEYS } from './keys';
import { readJson, writeJson } from './localStorageJson';

export function initStorage(): void {
  const stored = readJson<number>(STORAGE_KEYS.schemaVersion);
  if (stored === SCHEMA_VERSION) return;

  // For MVP: reset storage if schema changes.
  if (stored != null && stored !== SCHEMA_VERSION) {
    localStorage.removeItem(STORAGE_KEYS.wordLists);
    localStorage.removeItem(STORAGE_KEYS.activeSession);
    localStorage.removeItem(STORAGE_KEYS.history);
  }

  writeJson(STORAGE_KEYS.schemaVersion, SCHEMA_VERSION);
}

