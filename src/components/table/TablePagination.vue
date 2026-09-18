<script setup lang="ts">
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
</script>

<template>
  <Pagination
    v-if="databaseStore.pageCount > 1"
    :page="databaseStore.currentPage"
    @update:page="databaseStore.goToPage"
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
</template>
