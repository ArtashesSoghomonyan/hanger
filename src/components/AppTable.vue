<script setup lang="ts">
import { computed, ref, watch } from "vue"

import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination"

import { useDatabaseStore } from '@/stores/database'

const databaseStore = useDatabaseStore()

watch(
  () => databaseStore.currentPage,
  async (page) => {
    const activeElement = databaseStore.activeElement

    if (!activeElement || activeElement[0] !== "table") return

    const table = activeElement[1]
    const offset = (page - 1) * 22

    databaseStore.sql =
      `SELECT * FROM "${table}" LIMIT 22 OFFSET ${offset};`

    await databaseStore.runQuery()
  }
)

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

        <TableFooter>
          <Pagination
            v-if="databaseStore.pageCount > 1"
            v-model:page="databaseStore.currentPage"
            :items-per-page="22"
            :total="databaseStore.rowCount ?? 0"
            class="w-full"
          >
            <PaginationContent v-slot="{ items }" >
              <PaginationPrevious />
              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === databaseStore.currentPage"
                >
                  {{ item.value }}
                </PaginationItem>
                <PaginationEllipsis v-else />
              </template>
              <PaginationNext />
            </PaginationContent>
          </Pagination>
        </TableFooter>
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
