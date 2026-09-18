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

import TablePagination from "@/components/table/TablePagination.vue"
import { useDatabaseStore } from "@/stores/database"
import { useUIStore } from "@/stores/ui"

const databaseStore = useDatabaseStore()
const UIStore = useUIStore()

watch(
  () => databaseStore.currentPage,
  async (page) => {
    const activeElement = databaseStore.activeElement

    if (!activeElement || (activeElement[0] !== "table" && activeElement[0] !== "view")) return

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
      <TablePagination />
    </TableFooter>
  </table>
</template>
