import { ref, computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'

export interface Todo {
  id: number
  text: string
  completed: boolean
  userId: number
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const nextId = ref(1)
  const isLoading = ref(false)

  const filter = ref<'all' | 'completed' | 'pending'>('all')
  const searchQuery = ref('')

  // Pagination state
  const currentPage = ref(1)
  const itemsPerPage = ref(9)

  async function fetchTodos() {
    isLoading.value = true
    try {
      const response = await fetch('https://dummyjson.com/todos?limit=0')
      const data = await response.json()
      // The API uses 'todo' for the text, let's map it to 'text'
      todos.value = data.todos.map((todo: any) => ({
        id: todo.id,
        text: todo.todo,
        completed: todo.completed,
        userId: todo.userId,
      }))
      // Ensure our nextId is higher than any fetched ID
      nextId.value = Math.max(...todos.value.map(t => t.id)) + 1
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function addTodo(text: string) {
    try {
      const response = await fetch('https://dummyjson.com/todos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: text,
          completed: false,
          userId: 5, // Using a mock user ID as per API docs
        }),
      })
      const newTodo = await response.json()
      // The API uses 'todo' for the text, let's map it to 'text'
      todos.value.unshift({ ...newTodo, text: newTodo.todo })
    } catch (error) {
      console.error('Failed to add todo:', error)
    }
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find((todo) => todo.id === id)
    if (!todo) return

    // Optimistically update the UI
    todo.completed = !todo.completed

    // Send the update to the API
    fetch(`https://dummyjson.com/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        completed: todo.completed,
      }),
    }).catch(error => {
      console.error('Failed to toggle todo status:', error)
      // Revert the change on error
      todo.completed = !todo.completed
    })
  }

  async function editTodo(id: number, newText: string) {
    try {
      const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todo: newText,
        }),
      })
      const updatedTodo = await response.json()
      const index = todos.value.findIndex(t => t.id === id)
      if (index !== -1) {
        todos.value[index] = { ...updatedTodo, text: updatedTodo.todo }
      }
    } catch (error) {
      console.error('Failed to edit todo:', error)
    }
  }

  async function removeTodo(id: number) {
    await fetch(`https://dummyjson.com/todos/${id}`, { method: 'DELETE' })
    // The API response indicates success, so we can now remove it locally.
    todos.value = todos.value.filter((todo) => todo.id !== id)
  }

  const filteredTodos = computed(() => {
    let filtered = todos.value

    if (filter.value === 'completed') {
      filtered = filtered.filter((todo) => todo.completed)
    } else if (filter.value === 'pending') {
      filtered = filtered.filter((todo) => !todo.completed)
    }

    if (searchQuery.value) {
      filtered = filtered.filter((todo) =>
        todo.text.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    }

    return filtered
  })

  // New computed property for total pages
  const totalPages = computed(() => {
    return Math.ceil(filteredTodos.value.length / itemsPerPage.value)
  })

  // New computed property for paginated todos
  const paginatedTodos = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredTodos.value.slice(start, end)
  })

  function clearTodos() {
    todos.value = []
  }

  return {
    todos,
    nextId,
    isLoading,
    filter,
    searchQuery,
    currentPage,
    itemsPerPage,
    totalPages,
    // We will use paginatedTodos in the UI now
    paginatedTodos,
    addTodo,
    removeTodo,
    clearTodos,
    fetchTodos,
    editTodo,
    toggleTodo,
    // Keep filteredTodos for calculating totalPages
    filteredTodos
  }
}, {
  persist: true,
  // @ts-ignore
  persistedState: {
    paths: ['todos', 'nextId', 'itemsPerPage']
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useTodoStore, import.meta.hot))