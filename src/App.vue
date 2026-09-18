<script setup lang="ts">
import { onMounted } from "vue"
import { RouterView } from "vue-router"

import { useUIStore } from "@/stores/ui"

const UIStore = useUIStore()

onMounted(() => {
  UIStore.checkForUpdate()
})
</script>

<template>
  <main>
    <RouterView />
  </main>
</template>
