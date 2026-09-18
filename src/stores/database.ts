import { defineStore } from "pinia"
import { invoke } from "@tauri-apps/api/core"
import { computed, ref } from "vue"

import type { ActiveElementType, Connection, QueryResult, TriggerInfo, ViewInfo } from "@/types"
import { quoteIdentifier, toSqlInteger } from "@/lib/sql"
import { useUIStore } from "@/stores/ui"

export const useDatabaseStore = defineStore("database", () => {
  const UIStore = useUIStore()

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

  // Every query carries a sequence number so a slow response for a superseded
  // query can never overwrite the result of a newer one.
  let queryRequestId = 0

  function resetState() {
    queryRequestId++
    activeConnection.value = null
    activeElement.value = null
    tables.value = []
    views.value = []
    triggers.value = []
    viewSQL.value = null
    triggerName.value = null
    triggerTableName.value = null
    sql.value = ""
    result.value = null
    error.value = null
    loading.value = false
    rowCount.value = null
    currentPage.value = 1
    UIStore.breadcrumbs = []
  }

  function openConnection(
    connection: Connection,
    tableList: string[],
    viewsList: ViewInfo[],
    triggersList: TriggerInfo[]
  ) {
    // Never show leftovers from a previously opened database.
    resetState()

    activeConnection.value = connection
    tables.value = tableList
    triggers.value = triggersList
    views.value = viewsList
  }

  async function closeConnection() {
    const hadConnection = activeConnection.value !== null

    // Reset first: the UI reacts immediately and in-flight query results are dropped.
    resetState()
    if (!hadConnection) return

    try {
      await invoke<void>("close_database")
    } catch (error) {
      // The UI is already back at the welcome screen, but the Rust side may still
      // hold the file handle — surface the failure instead of hiding it.
      console.error("Failed to close database", error)
    }
  }

  async function runQuery() {
    const requestId = ++queryRequestId

    error.value = null
    loading.value = true
    try {
      const nextResult = await invoke<QueryResult>("run_query", { sql: sql.value })
      if (requestId !== queryRequestId) return
      result.value = nextResult
    } catch (err) {
      if (requestId !== queryRequestId) return
      result.value = null
      error.value = String(err)
    } finally {
      if (requestId === queryRequestId) loading.value = false
    }
  }

  /** Load a page of the active table or view; the only place that pages data. */
  async function goToPage(page: number) {
    const element = activeElement.value
    if (!element || (element[0] !== "table" && element[0] !== "view")) return

    const maxPage = rowCount.value === null ? Number.MAX_SAFE_INTEGER : pageCount.value
    const nextPage = Math.min(Math.max(1, Math.trunc(page)), maxPage)

    // Deliberately no "same page" early return: re-clicking the active page
    // re-runs the query, which doubles as a retry after a failed load.
    currentPage.value = nextPage
    const offset = (nextPage - 1) * UIStore.tableRowsPerPage

    sql.value = `SELECT * FROM ${quoteIdentifier(element[1])} LIMIT ${toSqlInteger(UIStore.tableRowsPerPage)} OFFSET ${toSqlInteger(offset)};`

    await runQuery()
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
    goToPage,
    openConnection,
    runQuery
  }
})
