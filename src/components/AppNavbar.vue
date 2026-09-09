<script setup lang="ts">
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

import { useUIStore } from '@/stores/ui';

const UIStore = useUIStore()
</script>

<template>
  <header class="flex h-14 shrink-0 items-center gap-2 border-b px-4">
    <SidebarTrigger />
    <Breadcrumb>
      <BreadcrumbList>
        <template v-for="(breadcrumb, index) in UIStore.breadcrumbs" :key="index">
          <BreadcrumbItem>{{ breadcrumb }}</BreadcrumbItem>
          <BreadcrumbSeparator v-if="index < UIStore.breadcrumbs.length - 1" />
        </template>
      </BreadcrumbList>
    </Breadcrumb>
  </header>
</template>
