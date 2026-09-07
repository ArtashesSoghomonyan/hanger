<script setup lang="ts">
import DatabaseView from "./views/DatabaseView.vue"
import WelcomeView from "@/views/WelcomeView.vue"
import { useDatabaseStore } from '@/stores/database'

const databaseStore = useDatabaseStore()

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
