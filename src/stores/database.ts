import { defineStore } from "pinia"
import { ref } from "vue"
import type { Connection, QueryResult } from "@/types"

export const useDatabaseStore = defineStore("database", () => {
  const activeConnection = ref<Connection | null>(null)
  const tables = ref<string[]>([])

  // Query data
  const sql = ref<string>("")
  const result = ref<QueryResult | null>(null)
  const error = ref<string | null>(null)
  const loading = ref<boolean>(false)

  function openConnection(connection: Connection, tableList: string[]) {
    activeConnection.value = connection
    tables.value = tableList
  }

  function closeConnection() {
    activeConnection.value = null
    tables.value = []
  }

  return {
    // State values
    activeConnection,
    error,
    loading,
    result,
    sql,
    tables,

    // Functions
    openConnection,
    closeConnection
  }
})
