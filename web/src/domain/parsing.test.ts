import { parseWordListText } from './parsing';

test('parseWordListText ignores blank lines', () => {
  const input = `\n\ncat\n\n\ndog\n`;
  expect(parseWordListText(input, 50)).toEqual(['cat', 'dog']);
});

test('parseWordListText preserves duplicates', () => {
  const input = `cat\ncat\ncat\n`;
  expect(parseWordListText(input, 50)).toEqual(['cat', 'cat', 'cat']);
});

test('parseWordListText caps to maxWords', () => {
  const input = Array.from({ length: 100 }, (_, i) => `word${i}`).join('\n');
  expect(parseWordListText(input, 50)).toHaveLength(50);
});

