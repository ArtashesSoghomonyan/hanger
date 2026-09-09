<script setup lang="ts">
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { useDatabaseStore } from '@/stores/database'

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

    <div v-else-if="databaseStore.result" class="min-h-0 flex-1 overflow-auto rounded-md border">
      <table class="w-full caption-bottom text-xs">
        <TableHeader>
          <TableRow class="hover:bg-transparent">
            <!-- How to create a sticky column -->
            <!-- <TableHead class="bg-background sticky left-0">ID</TableHead> -->
            <TableHead v-for="column in databaseStore.result.columns" :key="column">
              {{ column }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(row, rowIndex) in databaseStore.result.rows"
            :key="rowIndex"
            class="hover:bg-transparent"
          >
            <!-- <TableCell class="bg-background sticky left-0 font-medium">{invoice.id}</TableCell> -->
            <TableCell v-for="column in databaseStore.result.columns" :key="column">
              {{ row[column] === null || row[column] === undefined ? 'NULL' : String(row[column]) }}
            </TableCell>
          </TableRow>
        </TableBody>
      </table>
    </div>

    <div
      v-else-if="!databaseStore.error"
      class="flex flex-1 items-center justify-center text-sm text-muted-foreground"
    >
      Select a table from the sidebar, or run a query, to see results.
    </div>
  </div>
</template>
