export type PronounceOptions = {
  rate?: number;
  pitch?: number;
  volume?: number;
};

export interface Pronouncer {
  speak(text: string, options?: PronounceOptions): Promise<void>;
  cancel(): void;
  isSupported(): boolean;
}

