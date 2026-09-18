<script setup lang="ts">
// UI imports
import { ChevronRight, Eye, Table, Zap } from "@lucide/vue"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar"

// Local imports
import CloseModal from "@/components/CloseModal.vue"
import { quoteIdentifier, toSqlInteger } from "@/lib/sql"
import { useDatabaseStore } from "@/stores/database"
import { useUIStore } from "@/stores/ui"
import type { TriggerInfo, ViewInfo } from "@/types"

const databaseStore = useDatabaseStore()
const UIStore = useUIStore()

async function pickTable(table: string) {
  UIStore.breadcrumbs = ["Tables", table, "Data"]
  databaseStore.activeElement = ["table", table]

  databaseStore.sql = `SELECT COUNT(*) AS row_count FROM ${quoteIdentifier(table)};`
  await databaseStore.runQuery()

  databaseStore.rowCount = Number(
    databaseStore.result?.rows[0]?.row_count ?? 0
  )

  databaseStore.currentPage = 1
  const offset = (databaseStore.currentPage - 1) * UIStore.tableRowsPerPage

  databaseStore.sql = `SELECT * FROM ${quoteIdentifier(table)} LIMIT ${toSqlInteger(UIStore.tableRowsPerPage)} OFFSET ${toSqlInteger(offset)};`
  await databaseStore.runQuery()
}

async function pickView(view: ViewInfo) {
  UIStore.breadcrumbs = ["Views", view.name]
  databaseStore.activeElement = ["view", view.name]
  databaseStore.viewSQL = view.sql

  databaseStore.sql = `SELECT COUNT(*) AS row_count FROM ${quoteIdentifier(view.name)};`
  await databaseStore.runQuery()

  databaseStore.rowCount = Number(
    databaseStore.result?.rows[0]?.row_count ?? 0
  )

  databaseStore.currentPage = 1
  const offset = (databaseStore.currentPage - 1) * UIStore.tableRowsPerPage

  databaseStore.sql = `SELECT * FROM ${quoteIdentifier(view.name)} LIMIT ${toSqlInteger(UIStore.tableRowsPerPage)} OFFSET ${toSqlInteger(offset)};`
  await databaseStore.runQuery()
}

async function pickTrigger(trigger: TriggerInfo) {
  UIStore.breadcrumbs = ["Trigger", trigger.name]
  databaseStore.activeElement = ["trigger", trigger.name]
  databaseStore.viewSQL = trigger.sql
  databaseStore.triggerTableName = trigger.tbl_name
  databaseStore.triggerName = trigger.name
}

</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <div class="flex items-center justify-between gap-2 px-2">
        <span class="truncate text-sm font-bold">{{ databaseStore.activeConnection?.name }}</span>
        <CloseModal />
      </div>
    </SidebarHeader>

    <SidebarContent>
      <Collapsible class="group/collapsible">
        <CollapsibleTrigger as-child>
          <SidebarMenuButton>
            <Table />
            <span>Tables</span>
            <ChevronRight
              class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub v-for="table in databaseStore.tables" :key="table">
            <SidebarMenuSubItem>
              <SidebarMenuSubButton @click="pickTable(table)">
                {{ table }}
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible class="group/collapsible">
        <CollapsibleTrigger as-child>
          <SidebarMenuButton>
            <Eye />
            <span>Views</span>
            <ChevronRight
              class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub v-for="view in databaseStore.views" :key="view.name">
            <SidebarMenuSubItem>
              <SidebarMenuSubButton @click="pickView(view)">
                {{ view.name }}
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible class="group/collapsible">
        <CollapsibleTrigger as-child>
          <SidebarMenuButton>
            <Zap />
            <span>Triggers</span>
            <ChevronRight
              class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub v-for="trigger in databaseStore.triggers" :key="trigger.name">
            <SidebarMenuSubItem>
              <SidebarMenuSubButton @click="pickTrigger(trigger)">
                {{ trigger.name }}
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarContent>
  </Sidebar>
</template>
