import { defineStore } from "pinia"
import { ref } from "vue"


export const useUIStore = defineStore("ui", () => {
  const breadcrumbs = ref<string[]>([]);
  const tableRowsPerPage = ref<number>(20);

  return {
    breadcrumbs,
    tableRowsPerPage
  }
})
