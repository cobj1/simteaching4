export function useAnswerFormat(answer: string | null, type: string | null) {
  if (answer == null || answer == "null") return "";
  return type == "多选题" ? `${answer}`.split(",") : `${answer}`;
}
