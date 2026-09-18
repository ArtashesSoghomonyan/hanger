<script setup lang="ts">
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import AppNavbar from "@/components/AppNavbar.vue"
import AppSidebar from "@/components/AppSidebar.vue"
import AppTable from "@/components/AppTable.vue"
import AppView from "@/components/AppView.vue"
import { useDatabaseStore } from "@/stores/database"

const databaseStore = useDatabaseStore()
</script>

<template>
  <SidebarProvider class="h-dvh overflow-hidden">
    <AppSidebar />

    <SidebarInset class="min-w-0 overflow-hidden">
      <AppNavbar />

      <template v-if="databaseStore.activeElement === null">
        <h1>Nothing opened. Change me.</h1>
      </template>
      <template v-else-if="databaseStore.activeElement[0] === 'table'">
        <AppTable />
      </template>
      <template v-else-if="databaseStore.activeElement[0] === 'view'">
        <AppView />
      </template>
      <template v-else>
        <h1>Else</h1>
      </template>
    </SidebarInset>
  </SidebarProvider>
</template>
