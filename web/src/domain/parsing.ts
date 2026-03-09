export function parseWordListText(input: string, maxWords: number): string[] {
  const lines = input.split(/\r?\n/);
  const words: string[] = [];

  for (const rawLine of lines) {
    const word = rawLine.trim();
    if (!word) continue;
    words.push(word);
    if (words.length >= maxWords) break;
  }

  return words;
}

