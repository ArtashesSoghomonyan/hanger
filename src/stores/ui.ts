import { defineStore } from "pinia"
import { ref } from "vue"


export const useUIStore = defineStore("database", () => {
  const breadcrumbs = ref<string[]>([]);

  return {
    breadcrumbs
  }
})
