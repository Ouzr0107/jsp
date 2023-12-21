import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("userInfo", () => {
  const Token = ref("");

  function setToken(token: string) {
    Token.value = token;
    localStorage.setItem("satoken", token);
  }

  function removeInfo() {
    localStorage.clear();
    Token.value = "";
  }

  function saveTheme(theme: string) {
    localStorage.setItem("themeToken", theme);
  }

  return { Token, setToken, removeInfo, saveTheme};
});
