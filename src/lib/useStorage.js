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
    let result = null;

    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const item = window.localStorage.getItem(key);
        result = item ? JSON.parse(item) : null;
      } catch (error) {
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
    }

    return result;
  }

  function write() {
    if (typeof window !== "undefined" && window.localStorage) {
      if (val.value == null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(val.value));
      }
    }
  }

  return val;
}
