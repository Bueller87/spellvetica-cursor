export interface SentenceProvider {
  getSentence(word: string): Promise<string | null>;
}

