<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useDatabaseStore } from "@/stores/database"

const databaseStore = useDatabaseStore()
</script>

<template>
  <Dialog>
    <form>
      <DialogTrigger as-child>
        <Button variant="ghost">Close DB</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle class="text-center">Do you really want to close the database connection?</DialogTitle>
        </DialogHeader>
        <DialogFooter class="m-auto">
          <DialogClose as-child>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" @click="databaseStore.closeConnection()">Yes, close it</Button>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>
</template>
