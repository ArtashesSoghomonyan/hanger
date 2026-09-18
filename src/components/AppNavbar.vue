<script setup lang="ts">
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ArrowDownToLine, RotateCcw, Settings } from "@lucide/vue"
import { RouterLink } from "vue-router"

import { useUIStore } from "@/stores/ui"

const UIStore = useUIStore()
</script>

<template>
  <header class="flex h-10 shrink-0 items-center gap-2 border-b px-4 justify-between">
    <div class="flex items-center gap-2">
      <SidebarTrigger />
      <Breadcrumb>
        <BreadcrumbList>
          <template v-for="(breadcrumb, index) in UIStore.breadcrumbs" :key="index">
            <BreadcrumbItem>{{ breadcrumb }}</BreadcrumbItem>
            <BreadcrumbSeparator v-if="index < UIStore.breadcrumbs.length - 1" />
          </template>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <div>
      <Button
        v-if="UIStore.updateAvailable && UIStore.updateStatus !== 'restart-required'"
        variant="ghost"
        :disabled="UIStore.updateStatus === 'downloading' || UIStore.updateStatus === 'installing'"
        title="Install update"
        @click="UIStore.installUpdate"
      >
        <ArrowDownToLine />
        <span class="sr-only">Install update</span>
      </Button>
      <Button
        v-else-if="UIStore.updateStatus === 'restart-required'"
        variant="ghost"
        title="Restart to finish updating"
        @click="UIStore.restartApp"
      >
        Restart
        <RotateCcw />
      </Button>
      <Button as-child variant="ghost" title="Settings">
        <RouterLink to="/settings">
          <Settings />
          <span class="sr-only">Settings</span>
        </RouterLink>
      </Button>
    </div>
  </header>
</template>
