<script setup lang="ts">
import { ArrowLeft } from "@lucide/vue"
import { RouterLink } from "vue-router"
import { Palette } from '@lucide/vue'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import ThemeToggle from "@/components/ThemeToggle.vue"
</script>

<template>
  <div class="container mx-auto space-y-4 p-5 select-none">
    <Button as-child variant="outline">
      <RouterLink to="/">
        <ArrowLeft />
        <span>Back</span>
      </RouterLink>
    </Button>

    <h1 class="text-2xl font-bold">Settings</h1><hr>
    <h2 class="flex gap-2"><Palette />Appearance</h2>
    <div class="flex gap-2">
      <Label for="theme-toggle" class="text-lg">Theme:</Label>
      <ThemeToggle id="theme-toggle" />
    </div>
  </div>
</template>
