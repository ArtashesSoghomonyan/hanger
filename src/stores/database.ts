import { defineStore } from "pinia"
import { invoke } from "@tauri-apps/api/core"
import { computed, ref } from "vue"

import type { ActiveElementType, Connection, QueryResult, TriggerInfo, ViewInfo } from "@/types"
import { useUIStore } from "@/stores/ui"

export const useDatabaseStore = defineStore("database", () => {
  const UIStore = useUIStore();

  const activeConnection = ref<Connection | null>(null)

  // Data
  const tables = ref<string[]>([])
  const views = ref<ViewInfo[]>([])
  const triggers = ref<TriggerInfo[]>([])
  const viewSQL = ref<string | null>(null)
  const triggerName = ref<string | null>(null)
  const triggerTableName = ref<string | null>(null)

  // Query data
  const sql = ref<string>("")
  const result = ref<QueryResult | null>(null)
  const error = ref<string | null>(null)
  const loading = ref<boolean>(false)

  // Pagination
  const rowCount = ref<number | null>(null)
  const pageCount = computed<number>(() => {
    return Math.max(1, Math.ceil((rowCount.value ?? 0) / UIStore.tableRowsPerPage))
  })
  const currentPage = ref<number>(1)

  const activeElement = ref<[ActiveElementType, string] | null>(null)

  function openConnection(
    connection: Connection,
    tableList: string[],
    viewsList: ViewInfo[],
    triggersList: TriggerInfo[]
  ) {
    activeConnection.value = connection
    tables.value = tableList
    triggers.value = triggersList
    views.value = viewsList
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
    currentPage,
    error,
    loading,
    pageCount,
    result,
    rowCount,
    sql,
    tables,
    triggers,
    triggerName,
    triggerTableName,
    views,
    viewSQL,

    // Functions
    closeConnection,
    openConnection,
    runQuery
  }
})
