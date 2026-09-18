<script setup lang="ts">
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import TableData from "@/components/table/TableData.vue"
import TableIndexes from "@/components/table/TableIndexes.vue"
import { useDatabaseStore } from "@/stores/database"
import { useUIStore } from "@/stores/ui.ts"

const databaseStore = useDatabaseStore()
const UIStore = useUIStore()

const selectTab = (tab: string) => {
  UIStore.breadcrumbs[2] = tab
}

</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-3 p-4">
    <p v-if="databaseStore.error" class="text-xs text-destructive">
      {{ databaseStore.error }}
    </p>

    <div
      v-if="databaseStore.loading && !databaseStore.result"
      class="flex flex-1 items-center justify-center text-sm text-muted-foreground"
    >
      <h1>Loading…</h1>
    </div>

    <div v-else-if="databaseStore.result" class="min-h-0 flex-1 overflow-auto rounded-md border">
      <Tabs default-value="data" class="w-full">
        <TabsList>
          <TabsTrigger value="data" @click="selectTab('Data')">
            Table data
          </TabsTrigger>

          <TabsTrigger value="indexes" @click="selectTab('Indexes')">
            Indexes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data">
          <TableData />
        </TabsContent>

        <TabsContent value="indexes">
          <TableIndexes />
        </TabsContent>
      </Tabs>
    </div>

    <div
      v-else-if="!databaseStore.error"
      class="flex flex-1 items-center justify-center text-sm text-muted-foreground"
    >
      Select a table from the sidebar, or run a query, to see results.
    </div>
  </div>
</template>
