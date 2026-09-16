<script setup lang="ts">
import { onMounted } from "vue"

import DatabaseView from "@/views/DatabaseView.vue"
import WelcomeView from "@/views/WelcomeView.vue"
import { useDatabaseStore } from '@/stores/database'
import { useUIStore } from "@/stores/ui"
import { canUpdate } from "@/lib/utils"

const databaseStore = useDatabaseStore()
const UIStore = useUIStore()

onMounted(async () => {
  UIStore.updateAvailable = await canUpdate();
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
