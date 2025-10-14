import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TodoListView from '../views/TodoListView.vue'
import TodoDetailView from '../views/TodoDetailView.vue'
import NotFoundView from '../views/NotFoundView.vue'

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
      component: TodoDetailView,
      props: true
    },
    // Catch-all route for 404 Not Found pages
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundView
    }
  ]
})

export default router