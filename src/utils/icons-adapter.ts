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
    case "emoji-0":
      return "0️⃣";
    case "emoji-1":
      return "1️⃣";
    case "emoji-2":
      return "2️⃣";
    case "emoji-3":
      return "3️⃣";
    case "emoji-4":
      return "4️⃣";
    case "emoji-5":
      return "5️⃣";
    case "emoji-6":
      return "6️⃣";
    case "emoji-7":
      return "7️⃣";
    case "emoji-8":
      return "8️⃣";
    case "emoji-9":
      return "9️⃣";
    case "emoji-10":
      return "🔟";
  }
  return "circle-off-outline";
};
