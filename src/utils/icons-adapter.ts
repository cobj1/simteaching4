export const useIconsAdapter = (type: string) => {
  switch (type) {
    case "resource":
      return "mdi-book-outline";
    case "simulation":
      return "mdi-test-tube";
    case "questions":
      return "mdi-head-question-outline";
    case "testpaper":
      return "mdi-test-tube";
    case "report_template":
      return "mdi-file-word-box-outline";
    case "category":
      return "mdi-format-list-bulleted-type";
  }
  return "circle-off-outline";
};
