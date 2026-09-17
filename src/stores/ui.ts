import { defineStore } from "pinia"
import { check, type Update } from "@tauri-apps/plugin-updater"
import { relaunch } from "@tauri-apps/plugin-process"
import { computed, ref, shallowRef } from "vue"

type UpdateStatus = "idle" | "checking" | "downloading" | "installing" | "restart-required" | "error"

export const useUIStore = defineStore("ui", () => {
  const breadcrumbs = ref<string[]>([])
  const tableRowsPerPage = ref(20)
  const update = shallowRef<Update | null>(null)
  const updateStatus = ref<UpdateStatus>("idle")
  const updateError = ref<string | null>(null)
  const downloadedBytes = ref(0)
  const totalBytes = ref<number | null>(null)
  const updateAvailable = computed(() => update.value !== null)

  async function checkForUpdate() {
    updateStatus.value = "checking"
    updateError.value = null

    try {
      update.value = await check()
      updateStatus.value = "idle"
    } catch (error) {
      update.value = null
      updateStatus.value = "error"
      updateError.value = error instanceof Error ? error.message : "Unable to check for updates."
    }
  }

  async function installUpdate() {
    if (!update.value || updateStatus.value === "downloading" || updateStatus.value === "installing") return

    downloadedBytes.value = 0
    totalBytes.value = null
    updateError.value = null

    try {
      await update.value.downloadAndInstall((event) => {
        if (event.event === "Started") {
          updateStatus.value = "downloading"
          totalBytes.value = event.data.contentLength ?? null
        } else if (event.event === "Progress") {
          downloadedBytes.value += event.data.chunkLength
        } else {
          updateStatus.value = "installing"
        }
      })

      updateStatus.value = "restart-required"
    } catch (error) {
      updateStatus.value = "error"
      updateError.value = error instanceof Error ? error.message : "Unable to install the update."
    }
  }

  async function restartApp() {
    await relaunch()
  }

  return {
    breadcrumbs,
    tableRowsPerPage,
    update,
    updateAvailable,
    updateStatus,
    updateError,
    downloadedBytes,
    totalBytes,
    checkForUpdate,
    installUpdate,
    restartApp,
  }
})
