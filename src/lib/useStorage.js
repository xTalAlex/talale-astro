import { ref, watch } from "vue";

export function useStorage(key, defaultVal = null) {
  let storedVal = read();
  let val;

  if (storedVal !== undefined && storedVal !== null) {
    val = ref(storedVal);
  } else {
    val = ref(defaultVal);
    write(); // Assuming we want to immediately save the default value
  }

  watch(val, write, { deep: true });

  function read() {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  }

  function write() {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    if (val.value == null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, JSON.stringify(val.value));
    }
  }

  return val;
}
