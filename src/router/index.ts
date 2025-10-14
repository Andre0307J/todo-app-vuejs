import { createRouter, createWebHistory } from 'vue-router'
import TodoListView from '@/views/TodoListView.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/todos',
      name: 'todo-list',
      component: TodoListView
    },
    {
      path: '/todo/:id',
      name: 'todo-detail',
      component: () => import('../views/TodoDetailView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

export default router