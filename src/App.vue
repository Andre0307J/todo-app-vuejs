<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ChatWidget from '@/components/ChatWidget.vue'
import { useTodoStore } from '@/stores/todoStore'
import { Input } from '@/components/ui/input'
import { MessageSquareIcon } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select/index'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog/index'

// Initialize the store
const todoStore = useTodoStore()
const route = useRoute()
const isAddDialogOpen = ref(false)
const newTodoText = ref('')
const isSaving = ref(false)
const validationError = ref<string | null>(null)
const isChatOpen = ref(false)

async function handleSaveNewTodo() {
  if (!newTodoText.value.trim()) {
    validationError.value = 'You must add a todo'
    return
  }
  validationError.value = null

  isSaving.value = true
  try {
    await todoStore.addTodo(newTodoText.value)
    isAddDialogOpen.value = false
    newTodoText.value = ''
  } finally {
    isSaving.value = false
  }
}

</script>

<template>
  <header v-if="route.name !== 'home' && !todoStore.isLoading" class="border-b bg-white/90 backdrop-blur-sm">
    <div class="mx-auto flex h-19 max-w-8xl items-center justify-between px-4">
      <!-- Title -->
      <RouterLink to="/" class="flex items-center gap-4">
        <h1 class="text-3xl font-bold tracking-tight">My Todos</h1>
      </RouterLink>
      <!-- Controls -->
      <div v-if="route.name === 'todo-list' && !todoStore.isLoading" class="flex items-center gap-4">
        <Select v-model="todoStore.filter">
          <SelectTrigger class="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Dialog v-model:open="isAddDialogOpen">
          <DialogTrigger as-child>
            <Button class="ml-2 px-6 py-2 text-base font-semibold">Add New Todo</Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a new todo</DialogTitle>
              <DialogDescription>What do you need to get done?</DialogDescription>
            </DialogHeader>
            <div class="py-4">
              <Input v-model="newTodoText" placeholder="e.g. Finish the Vue migration" @keyup.enter="handleSaveNewTodo" />
              <p v-if="validationError" class="pt-2 text-sm text-destructive">{{ validationError }}</p>
            </div>
            <DialogFooter>
              <Button @click="handleSaveNewTodo" :disabled="isSaving">
                {{ isSaving ? 'Saving...' : 'Save Todo' }}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </header>
  <main class="mx-auto max-w-8xl p-4 md:p-6">
    <RouterView />
  </main>
  <!-- Chat Widget and Trigger -->
  <ChatWidget :is-open="isChatOpen" @close="isChatOpen = false" />
  <Button
    v-if="!isChatOpen"
    class="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
    @click="isChatOpen = true"
  >
    <MessageSquareIcon class="h-6 w-6" />
  </Button>
</template>
