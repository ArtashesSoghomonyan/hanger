<script setup lang="ts">
import { open } from "@tauri-apps/plugin-dialog"
import { invoke } from "@tauri-apps/api/core"
import { Button } from "@/components/ui/button"
import { useDatabaseStore } from "@/stores/database"
import { useUIStore } from "@/stores/ui"

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
    <div v-if="UIStore.updateAvailable">There is an update available</div>
  </div>
</template>
