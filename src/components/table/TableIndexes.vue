<script setup lang="ts">
import { ref, watch } from "vue"
import { invoke } from "@tauri-apps/api/core"
import { useDatabaseStore } from "@/stores/database"

type IndexInfo = { name: string; sql: string | null }

const databaseStore = useDatabaseStore()
const indexes = ref<IndexInfo[]>([])

watch(
  () => databaseStore.activeElement,
  async (element) => {
    if (element?.[0] !== "table") return
    indexes.value = await invoke("list_table_indexes", { table: element[1] })
  },
  { immediate: true },
)
</script>

<template>
  <div class="space-y-2 p-4">
    <div v-for="index in indexes" :key="index.name" class="rounded border p-3">
      <p class="font-medium">{{ index.name }}</p>
      <pre v-if="index.sql" class="mt-2 text-xs">{{ index.sql }}</pre>
      <p v-else class="text-sm text-muted-foreground">SQLite-generated index</p>
    </div>
    <p v-if="!indexes.length">No indexes on this table.</p>
  </div>
</template>
