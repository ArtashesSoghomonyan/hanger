import { defineStore } from "pinia"
import { ref } from "vue"
import type { Connection } from "@/types"

export const useDatabaseStore = defineStore("database", () => {
  const activeConnection = ref<Connection | null>(null)
  const tables = ref<string[]>([])

  function openConnection(connection: Connection, tableList: string[]) {
    activeConnection.value = connection
    tables.value = tableList
  }

  function closeConnection() {
    activeConnection.value = null
    tables.value = []
  }

  return { activeConnection, tables, openConnection, closeConnection }
})
