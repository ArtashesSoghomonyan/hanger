<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import Navbar from "@/components/Navbar.vue"
import Sidebar from "@/components/Sidebar.vue"
import { Button } from "@/components/ui/button"
import { useDatabaseStore } from "@/stores/database"
import { useUIStore } from "@/stores/ui"
import type { QueryResult } from "@/types"

const databaseStore = useDatabaseStore()
const UIStore = useUIStore()

async function runQuery() {
  databaseStore.error = null
  databaseStore.loading = true
  try {
    databaseStore.result = await invoke<QueryResult>("run_query", { sql: databaseStore.sql })
  } catch (err) {
    databaseStore.result = null
    databaseStore.error = String(err)
  } finally {
    databaseStore.loading = false
  }
}

function fillQueryForTable(table: string) {
  UIStore.breadcrumbs = ["Tables", table]
  databaseStore.sql = `SELECT * FROM "${table}" LIMIT 24;`
}
</script>

<template>
  <SidebarProvider>
    <Sidebar />

    <SidebarInset>
      <Navbar />
      <div class="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div class="flex flex-col gap-2">
          <textarea
            v-model="databaseStore.sql"
            rows="3"
            placeholder="SELECT * FROM albums LIMIT 24;"
            class="border-input bg-input/20 focus-visible:border-ring focus-visible:ring-ring/30 w-full rounded-md border p-2 font-mono text-xs outline-none transition-colors focus-visible:ring-2 placeholder:text-muted-foreground"
            @keydown.ctrl.enter="runQuery"
            @keydown.meta.enter="runQuery"
          />
          <div class="flex justify-end">
            <Button :disabled="databaseStore.loading" @click="runQuery">
              {{ databaseStore.loading ? "Running…" : "Run" }}
            </Button>
          </div>
        </div>

        <p v-if="databaseStore.error" class="text-xs text-destructive">{{ databaseStore.error }}</p>

        <div v-if="databaseStore.result" class="min-w-0 overflow-auto rounded-md border">
          <table class="w-full border-collapse text-xs">
            <thead>
              <tr class="border-b bg-muted/50 text-left">
                <th
                  v-for="column in databaseStore.result.columns"
                  :key="column"
                  class="whitespace-nowrap px-2 py-1 font-medium"
                >
                  {{ column }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in databaseStore.result.rows" :key="rowIndex" class="border-b last:border-0">
                <td
                  v-for="column in databaseStore.result.columns"
                  :key="column"
                  class="max-w-72 truncate px-2 py-1 font-mono text-muted-foreground"
                >
                  {{ row[column] === null || row[column] === undefined ? "NULL" : String(row[column]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
