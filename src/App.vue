<script setup lang="ts">
import { onMounted } from "vue"

import DatabaseView from "@/views/DatabaseView.vue"
import WelcomeView from "@/views/WelcomeView.vue"
import { useDatabaseStore } from "@/stores/database"
import { useUIStore } from "@/stores/ui"

const databaseStore = useDatabaseStore()
const UIStore = useUIStore()

onMounted(() => {
  UIStore.checkForUpdate()
})

</script>

<template>
  <main>
    <template v-if="databaseStore.activeConnection">
      <DatabaseView />
    </template>
    <template v-else>
      <WelcomeView />
    </template>
  </main>
</template>
