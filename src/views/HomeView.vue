<script setup lang="ts">
import DatabaseView from "@/views/DatabaseView.vue"
import WelcomeView from "@/views/WelcomeView.vue"
import { useDatabaseStore } from "@/stores/database"

const databaseStore = useDatabaseStore()
</script>

<template>
  <DatabaseView v-if="databaseStore.activeConnection" />
  <WelcomeView v-else />
</template>
