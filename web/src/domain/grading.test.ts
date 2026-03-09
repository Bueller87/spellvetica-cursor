import { gradeAnswer } from './grading';

test('gradeAnswer trims outside whitespace', () => {
  expect(gradeAnswer('Cat', '  Cat  ').isCorrect).toBe(true);
});

test('gradeAnswer is strict about capitalization', () => {
  expect(gradeAnswer('Cat', 'cat').isCorrect).toBe(false);
});

test('gradeAnswer is strict about punctuation', () => {
  expect(gradeAnswer("they're", 'theyre').isCorrect).toBe(false);
});

