<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTodoStore } from '@/stores/todoStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card/index'
import { Badge } from '@/components/ui/badge/index'
import { Button } from '@/components/ui/button'

const route = useRoute()
const todoStore = useTodoStore()

const todoId = Number(route.params.id)
const todo = computed(() => todoStore.todos.find(t => t.id === todoId))

onMounted(async () => {
  // If todos haven't been fetched yet, fetch them all.
  // This handles the case where a user directly navigates to a detail page.
  if (todoStore.todos.length === 0 && !todoStore.isLoading) {
    // The fetchTodos action will set isLoading to true, then false when done.
    todoStore.fetchTodos()
  }
})
</script>

<template>
  <div class="mx-auto max-w-2xl">
    <Button variant="outline" as-child class="mb-8">
      <RouterLink to="/todos">&larr; Back to Todos</RouterLink>
    </Button>
    <div v-if="todoStore.isLoading" class="flex h-[50vh] flex-col items-center justify-center gap-4">
      <svg class="h-12 w-12 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-lg text-muted-foreground">Fetching todo details...</p>
    </div>
    <template v-else>
      <Card v-if="todo">
        <CardHeader>
          <CardTitle class="text-2xl">{{ todo.text }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2">
            <p class="text-lg">Status:</p>
            <Badge :variant="todo.completed ? 'secondary' : 'default'">{{ todo.completed ? 'Completed' : 'Pending' }}</Badge>
          </div>
        </CardContent>
      </Card>
      <div v-else class="text-center">Todo not found.</div>
    </template>
  </div>
</template>