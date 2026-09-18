<script setup lang="ts">
import { ref, watch } from "vue"
import { invoke } from "@tauri-apps/api/core"
import { useDatabaseStore } from "@/stores/database"
import type { IndexInfo } from "@/types"

const databaseStore = useDatabaseStore()
const indexes = ref<IndexInfo[]>([])
const error = ref<string | null>(null)
const loading = ref<boolean>(false)

// Ignore responses for a table the user has already navigated away from.
let requestId = 0

watch(
  () => databaseStore.activeElement,
  async (element) => {
    const currentRequest = ++requestId

    indexes.value = []
    error.value = null

    if (element?.[0] !== "table") {
      loading.value = false
      return
    }

    loading.value = true
    try {
      const nextIndexes = await invoke<IndexInfo[]>("list_table_indexes", { table: element[1] })
      if (currentRequest !== requestId) return
      indexes.value = nextIndexes
    } catch (err) {
      if (currentRequest !== requestId) return
      error.value = String(err)
    } finally {
      if (currentRequest === requestId) loading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="space-y-2 p-4">
    <p v-if="loading" class="text-sm text-muted-foreground">Loading…</p>
    <p v-else-if="error" class="text-sm text-destructive">{{ error }}</p>
    <template v-else>
      <div v-for="index in indexes" :key="index.name" class="rounded border p-3">
        <p class="font-medium">{{ index.name }}</p>
        <pre v-if="index.sql" class="mt-2 text-xs">{{ index.sql }}</pre>
        <p v-else class="text-sm text-muted-foreground">SQLite-generated index</p>
      </div>
      <p v-if="!indexes.length">No indexes on this table.</p>
    </template>
  </div>
</template>
