import type { PronounceOptions, Pronouncer } from './Pronouncer';

export class SpeechSynthesisPronouncer implements Pronouncer {
  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.speechSynthesis !== 'undefined' &&
      typeof window.SpeechSynthesisUtterance !== 'undefined'
    );
  }

  cancel(): void {
    if (!this.isSupported()) return;
    window.speechSynthesis.cancel();
  }

  async speak(text: string, options?: PronounceOptions): Promise<void> {
    if (!this.isSupported()) return;

    const trimmed = text.trim();
    if (trimmed.length === 0) return;

    this.cancel();

    await new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(trimmed);
      utterance.rate = options?.rate ?? 0.9;
      utterance.pitch = options?.pitch ?? 1;
      utterance.volume = options?.volume ?? 1;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }
}

