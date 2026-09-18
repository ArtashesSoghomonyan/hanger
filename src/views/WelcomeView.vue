<script setup lang="ts">
import { open } from "@tauri-apps/plugin-dialog"
import { invoke } from "@tauri-apps/api/core"
import { Button } from "@/components/ui/button"
import { useDatabaseStore } from "@/stores/database"
import { useUIStore } from "@/stores/ui"
import type { TriggerInfo, ViewInfo } from "@/types"

const databaseStore = useDatabaseStore()
const UIStore = useUIStore()
const appVersion = __APP_VERSION__

async function openSqlite() {
  const path = await open({
    multiple: false,
    filters: [{ name: "SQLite Database", extensions: ["db", "sqlite", "sqlite3", "db3"] }],
  })
  if (typeof path !== "string") return

  try {
    await invoke("open_sqlite_database", { path })
    const tables = await invoke<string[]>("list_tables")
    const triggers = await invoke<TriggerInfo[]>("list_triggers")
    const views = await invoke<ViewInfo[]>("list_views")

    databaseStore.openConnection(
      {
        id: crypto.randomUUID(),
        name: path.split(/[\\/]/).pop() ?? path,
        config: {
          type: "sqlite",
          path,
        },
      },
      tables,
      views,
      triggers
    )
  } catch (error) {
    console.error("Failed to open database", error)
  }
}
</script>

<template>
  <div class="container mx-auto p-5">
    <nav>
      <div class="text-4xl font-bold select-none">Hanger v{{ appVersion }}</div>
    </nav>
    <Button variant="outline" @click="openSqlite">Open SQLite DB</Button>
    <div v-if="UIStore.updateAvailable" class="mt-4 space-y-2">
      <p>Version {{ UIStore.update?.version }} is available.</p>
      <Button
        v-if="UIStore.updateStatus !== 'restart-required'"
        :disabled="UIStore.updateStatus === 'downloading' || UIStore.updateStatus === 'installing'"
        @click="UIStore.installUpdate"
      >
        {{ UIStore.updateStatus === "downloading" ? "Downloading update..." : "Update now" }}
      </Button>
      <p v-if="UIStore.updateStatus === 'downloading' && UIStore.totalBytes !== null">
        {{ Math.round((UIStore.downloadedBytes / UIStore.totalBytes) * 100) }}% downloaded
      </p>
      <p v-else-if="UIStore.updateStatus === 'installing'">Installing update...</p>
      <Button v-else-if="UIStore.updateStatus === 'restart-required'" @click="UIStore.restartApp">
        Restart now
      </Button>
    </div>
    <p v-if="UIStore.updateError" class="mt-4 text-destructive" role="alert">
      {{ UIStore.updateError }}
    </p>
  </div>
</template>
