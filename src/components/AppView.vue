<script setup lang="ts">
import { Card } from "@/components/ui/card"

import TableData from "@/components/table/TableData.vue"
import { useDatabaseStore } from "@/stores/database"
import SQLCode from "@/components/SQLCode.vue";

const databaseStore = useDatabaseStore()
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

    <div v-else-if="databaseStore.result" class="flex min-h-0 flex-1 flex-col gap-3">
      <Card v-if="databaseStore.viewSQL" class="max-h-20 shrink-0 overflow-hidden">
        <CardContent class="no-scrollbar min-h-0 flex-1 overflow-auto overscroll-contain">
          <SQLCode :code="databaseStore.viewSQL" class="p-2" />
        </CardContent>
      </Card>

      <div class="min-h-0 flex-1 overflow-auto rounded-md border">
        <TableData />
      </div>
    </div>

    <div
      v-else-if="!databaseStore.error"
      class="flex flex-1 items-center justify-center text-sm text-muted-foreground"
    >
      Select a table from the sidebar, or run a query, to see results.
    </div>
  </div>
</template>
