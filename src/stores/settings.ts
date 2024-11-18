import { defineStore } from "pinia";
import { useTheme } from "vuetify";
import { ref, watch } from "vue";
import { useDark } from "@vueuse/core";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const theme = useTheme();
    const isSystemDark = useDark();

    const useSystemThemes = ref(true);
    const isDark = ref(theme.global.name.value == "dark");

    const updateThemo = (value: boolean) => {
      if (value) {
        theme.global.name.value = "dark";
        document.body.classList.add("ckeditor-dark");
      } else {
        theme.global.name.value = "light";
        document.body.classList.remove("ckeditor-dark");
      }
    };

    const initTheme = (value: boolean = isSystemDark.value) => {
      if (useSystemThemes.value) {
        isDark.value = value;
      } else {
        updateThemo(isDark.value);
      }
    };

    watch(isDark, (value) => updateThemo(value));

    watch(isSystemDark, (value) => initTheme(value), {
      immediate: true,
    });

    return {
      useSystemThemes,
      isDark,
      initTheme,
    };
  },
  {
    persist: true,
  }
);
