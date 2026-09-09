import { defineStore } from "pinia"
import { invoke } from "@tauri-apps/api/core"
import { ref } from "vue"

import type { ActiveElementType, Connection, QueryResult } from "@/types"

export const useDatabaseStore = defineStore("database", () => {
  const activeConnection = ref<Connection | null>(null)
  const tables = ref<string[]>([])

  // Query data
  const sql = ref<string>("")
  const result = ref<QueryResult | null>(null)
  const error = ref<string | null>(null)
  const loading = ref<boolean>(false)

  const activeElement = ref<[ActiveElementType, string] | null>(null)

  function openConnection(connection: Connection, tableList: string[]) {
    activeConnection.value = connection
    tables.value = tableList
  }

  function closeConnection() {
    activeConnection.value = null
    tables.value = []
  }

  async function runQuery() {
    error.value = null
    loading.value = true
    try {
      result.value = await invoke<QueryResult>("run_query", { sql: sql.value })
    } catch (err) {
      result.value = null
      error.value = String(err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State values
    activeConnection,
    activeElement,
    error,
    loading,
    result,
    sql,
    tables,

    // Functions
    closeConnection,
    openConnection,
    runQuery
  }
})
