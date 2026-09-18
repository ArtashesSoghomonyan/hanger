<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card"

import { useDatabaseStore } from "@/stores/database"
import SQLCode from "@/components/SQLCode.vue"

const databaseStore = useDatabaseStore()
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-3 p-4">
    <Card>
      <CardContent class="space-y-1 p-2">
        <p>Trigger Name: {{ databaseStore.triggerName ?? "—" }}</p>
        <p>Table: {{ databaseStore.triggerTableName ?? "—" }}</p>
      </CardContent>
    </Card>

    <Card v-if="databaseStore.viewSQL" class="min-h-0 flex-1 overflow-hidden">
      <CardContent class="no-scrollbar min-h-0 flex-1 overflow-auto overscroll-contain">
        <SQLCode :code="databaseStore.viewSQL" class="p-2" />
      </CardContent>
    </Card>
    <p v-else class="text-xs text-muted-foreground">
      SQLite does not store a definition for this trigger.
    </p>
  </div>
</template>
