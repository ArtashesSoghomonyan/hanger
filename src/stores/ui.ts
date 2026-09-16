import { defineStore } from "pinia"
import { ref } from "vue"


export const useUIStore = defineStore("ui", () => {
  const breadcrumbs = ref<string[]>([]);
  const tableRowsPerPage = ref<number>(20);
  const updateAvailable = ref<boolean | null>(null);

  return {
    breadcrumbs,
    tableRowsPerPage,
    updateAvailable,
  }
})
