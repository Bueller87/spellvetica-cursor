export type GradeResult = {
  isCorrect: boolean;
  typedNormalized: string | null;
};

export function gradeAnswer(word: string, typed: string | null): GradeResult {
  if (typed == null) return { isCorrect: false, typedNormalized: null };
  const normalized = typed.trim();
  return { isCorrect: word === normalized, typedNormalized: normalized };
}

