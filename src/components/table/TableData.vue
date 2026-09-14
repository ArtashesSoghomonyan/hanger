<script setup lang="ts">
import { watch } from "vue"

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

import { useDatabaseStore } from "@/stores/database"
import { useUIStore } from "@/stores/ui"

const databaseStore = useDatabaseStore()
const UIStore = useUIStore()

watch(
  () => databaseStore.currentPage,
  async (page) => {
    const activeElement = databaseStore.activeElement

    if (!activeElement || activeElement[0] !== "table") return

    const table = activeElement[1]
    const offset = (page - 1) * UIStore.tableRowsPerPage

    databaseStore.sql = `SELECT * FROM "${table}" LIMIT ${UIStore.tableRowsPerPage} OFFSET ${offset};`

    await databaseStore.runQuery()
  }
)

</script>

<template>
  <table class="w-full caption-bottom text-xs">
    <TableHeader>
      <TableRow class="hover:bg-transparent">
        <!-- How to create a sticky column -->
        <!-- <TableHead class="bg-background sticky left-0">ID</TableHead> -->
        <TableHead v-for="column in databaseStore.result?.columns" :key="column">
          {{ column }}
        </TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      <TableRow
        v-for="(row, rowIndex) in databaseStore.result?.rows"
        :key="rowIndex"
        class="hover:bg-transparent"
      >
        <!-- <TableCell class="bg-background sticky left-0 font-medium">{invoice.id}</TableCell> -->
        <TableCell v-for="column in databaseStore.result?.columns" :key="column">
          {{ row[column] === null || row[column] === undefined ? 'NULL' : String(row[column]) }}
        </TableCell>
      </TableRow>
    </TableBody>

    <TableFooter>
      <Pagination
        v-if="databaseStore.pageCount > 1"
        v-model:page="databaseStore.currentPage"
        :items-per-page="UIStore.tableRowsPerPage"
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
</template>
