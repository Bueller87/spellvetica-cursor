import type { SentenceProvider } from './SentenceProvider';

export class NullSentenceProvider implements SentenceProvider {
  async getSentence(_word: string): Promise<string | null> {
    return null;
  }
}

