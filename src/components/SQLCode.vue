<script setup lang="ts">
import { computed } from "vue"

import { highlightSql } from "@/lib/utils"

const props = defineProps<{ code: string}>()

const html = computed(() => highlightSql(props.code))
</script>

<template>
  <pre class="text-xs whitespace-pre-wrap break-words"><code v-html="html" /></pre>
</template>
