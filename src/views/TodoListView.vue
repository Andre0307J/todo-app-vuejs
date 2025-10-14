<script setup lang="ts">
import { onMounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'
import TodoItem from '@/components/TodoItem.vue'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination/index';
import { Button } from '@/components/ui/button'

const todoStore = useTodoStore()

// Fetch todos only when this view is mounted and if they haven't been fetched yet.
onMounted(() => {
  // If todos are not present, fetch them. The store will manage the loading state.
  if (todoStore.todos.length === 0 && !todoStore.isLoading) {
    todoStore.fetchTodos();
  }
});
</script>

<template>
  <div v-if="todoStore.isLoading" class="flex h-[70vh] flex-col items-center justify-center gap-4">
    <svg class="h-12 w-12 animate-spin text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p class="text-lg text-muted-foreground">Fetching Todos...</p>
  </div>
  <div v-else>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <TodoItem
        v-for="todo in todoStore.paginatedTodos"
        :key="todo.id"
        :todo="todo"
      />
    </div>
    <div class="mt-8">
      <Pagination
        v-if="todoStore.totalPages > 1"
        v-model:page="todoStore.currentPage"
        :total="todoStore.filteredTodos.length"
        :items-per-page="todoStore.itemsPerPage"
        :sibling-count="1"
        show-edges
      >
        <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
          <PaginationPrevious />

          <template v-for="(item, index) in items">
            <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value">
              <Button
                class="h-10 w-10 p-0"
                :variant="item.value === todoStore.currentPage ? 'default' : 'outline'"
              >
                {{ item.value }}
              </Button>
            </PaginationItem>
            <PaginationEllipsis v-else :key="item.type" :index="index" />
          </template>

          <PaginationNext />
        </PaginationContent>
      </Pagination>
    </div>
  </div>
</template>