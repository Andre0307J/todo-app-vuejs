import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTodoStore } from '@/stores/todoStore'

describe('Todo Store', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance and make it active
    // so it doesn't leak state between tests.
    setActivePinia(createPinia())
  })

  it('initializes with an empty list of todos', () => {
    const store = useTodoStore()
    expect(store.todos).toEqual([])
    expect(store.isLoading).toBe(false)
  })

  it('adds a new todo', async () => {
    const store = useTodoStore()
    // Mock the global fetch function for this test
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ id: 1, todo: 'Test Todo', completed: false, userId: 1 }),
    })

    await store.addTodo('Test Todo')

    expect(store.todos.length).toBe(1)
    expect(store.todos[0]?.text).toBe('Test Todo')
  })
})