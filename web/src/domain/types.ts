export type IsoDateTimeString = string;

export type WordList = {
  id: string;
  name: string;
  words: string[];
  createdAt: IsoDateTimeString;
};

export type TestSession = {
  id: string;
  wordListId: string;
  wordListName: string;
  words: string[];
  currentIndex: number;
  answers: Array<string | null>;
  skippedWordIndexes: number[];
  startedAt: IsoDateTimeString;
  updatedAt: IsoDateTimeString;
};

export type TestHistoryEntry = {
  id: string;
  wordListId: string;
  wordListName: string;
  date: IsoDateTimeString;
  words: string[];
  answers: Array<string | null>;
  correctCount: number;
  totalCount: number;
  missedWords: string[];
};

