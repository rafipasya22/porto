import { ref, watch } from "vue";

export type Lang = "en" | "id";

function readStored(): Lang {
  try {
    return localStorage.getItem("lang") === "id" ? "id" : "en";
  } catch {
    return "en"; 
  }
}

export const lang = ref<Lang>(readStored());

export function setLang(v: Lang) {
  lang.value = v;
}

watch(
  lang,
  (v) => {
    document.documentElement.lang = v;
    try {
      localStorage.setItem("lang", v);
    } catch {
    }
  },
  { immediate: true },
);