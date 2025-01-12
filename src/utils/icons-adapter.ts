export const IconsAdapter = (type: string) => {
  switch (type) {
    case "resource":
      return "mdi-test-tube";
    case "simulation":
      return "mdi-test-tube";
    case "questions":
      return "mdi-test-tube";
    case "testpaper":
      return "mdi-test-tube";
  }
  return 'circle-off-outline';
};
