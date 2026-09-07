<script setup lang="ts">
import { ref } from "vue"
import { invoke } from "@tauri-apps/api/core"
import { ChevronRight, Table } from "@lucide/vue"

import Navbar from "@/components/Navbar.vue"
import { Button } from "@/components/ui/button"
import { useDatabaseStore } from "@/stores/database"
import type { QueryResult } from "@/types"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import {
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar'
import { useUIStore } from "@/stores/ui"

const databaseStore = useDatabaseStore()
const UIStore = useUIStore()

const sql = ref("")
const result = ref<QueryResult | null>(null)
const error = ref<string | null>(null)
const loading = ref(false)

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

function fillQueryForTable(table: string) {
  UIStore.breadcrumbs = ["Tables", table]
  sql.value = `SELECT * FROM "${table}" LIMIT 24;`
}
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader>
        <div class="flex items-center justify-between gap-2 px-2">
          <span class="truncate text-sm font-bold">{{ databaseStore.activeConnection?.name }}</span>
          <Button variant="ghost" size="xs" @click="databaseStore.closeConnection()">Close</Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Collapsible>
          <CollapsibleTrigger as-child>
            <SidebarMenuButton>
              <Table />
              <span>Tables</span>
              <ChevronRight
                class="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-90"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub v-for="table in databaseStore.tables" :key="table">
              <SidebarMenuSubItem>
                <SidebarMenuSubButton @click="fillQueryForTable(table)">
                  {{ table }}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarContent>
    </Sidebar>

    <SidebarInset>
      <Navbar />

      <div class="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div class="flex flex-col gap-2">
          <textarea
            v-model="sql"
            rows="3"
            placeholder="SELECT * FROM albums LIMIT 24;"
            class="border-input bg-input/20 focus-visible:border-ring focus-visible:ring-ring/30 w-full rounded-md border p-2 font-mono text-xs outline-none transition-colors focus-visible:ring-2 placeholder:text-muted-foreground"
            @keydown.ctrl.enter="runQuery"
            @keydown.meta.enter="runQuery"
          />
          <div class="flex justify-end">
            <Button :disabled="loading" @click="runQuery">
              {{ loading ? "Running…" : "Run" }}
            </Button>
          </div>
        </div>

        <p v-if="error" class="text-xs text-destructive">{{ error }}</p>

        <div v-if="result" class="min-w-0 overflow-auto rounded-md border">
          <table class="w-full border-collapse text-xs">
            <thead>
              <tr class="border-b bg-muted/50 text-left">
                <th
                  v-for="column in result.columns"
                  :key="column"
                  class="whitespace-nowrap px-2 py-1 font-medium"
                >
                  {{ column }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, rowIndex) in result.rows" :key="rowIndex" class="border-b last:border-0">
                <td
                  v-for="column in result.columns"
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
