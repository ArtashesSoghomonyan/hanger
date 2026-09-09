<script setup lang="ts">

// UI imports
import { ChevronRight, Table } from "@lucide/vue"
import { Button } from "@/components/ui/button"
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
import { useDatabaseStore } from "@/stores/database"
import { useUIStore } from "@/stores/ui"

const databaseStore = useDatabaseStore()
const UIStore = useUIStore()

function pickTable(table: string) {
  UIStore.breadcrumbs = ["Tables", table]
  databaseStore.activeElement = ["table", table]
  databaseStore.sql = `SELECT * FROM "${table}" LIMIT 24;`
  databaseStore.runQuery()
}

</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <div class="flex items-center justify-between gap-2 px-2">
        <span class="truncate text-sm font-bold">{{ databaseStore.activeConnection?.name }}</span>
        <Button variant="ghost" size="xs" @click="databaseStore.closeConnection()">Close</Button>
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
    </SidebarContent>
  </Sidebar>
</template>
