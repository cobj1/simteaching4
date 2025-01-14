export function useAnswerFormat(answer: string | null, type: string | null) {
  if (answer == null || answer == "null") return "";
  if (type == "多选题") {
    return `${answer}`.split(",");
  } else if (type == "仿真题") {
    return answer;
  } else {
    return `${answer}`;
  }
}
