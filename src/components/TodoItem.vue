<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from 'lucide-vue-next'
import { useTodoStore, type Todo } from '@/stores/todoStore'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge/index'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card/index'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu/index'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog/index'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog/index'
import { Input } from '@/components/ui/input'

// Define the props this component accepts, with type safety
const props = defineProps<{
  todo: Todo
}>()

const todoStore = useTodoStore()
const router = useRouter()

// Local state for the edit dialog
const isEditDialogOpen = ref(false)
const editedText = ref(props.todo.text)

function handleSaveChanges() {
  if (editedText.value.trim()) {
    todoStore.editTodo(props.todo.id, editedText.value)
    isEditDialogOpen.value = false // Close the dialog
  }
}

function navigateToDetails() {
  router.push(`/todo/${props.todo.id}`)
}
</script>

<template>
  <Card class="cursor-pointer transition-colors hover:border-primary" @click="navigateToDetails">
    <CardHeader class="flex flex-row items-center justify-between pb-2">
      <div class="flex items-center">
        <span class="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {{ props.todo.id }}
        </span>
        <CardTitle :class="cn('text-base font-medium leading-snug', props.todo.completed && 'text-muted-foreground line-through')">
          {{ props.todo.text }}
        </CardTitle>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child @click.stop.prevent>
          <Button variant="ghost" class="h-8 w-8 p-0"><MoreHorizontalIcon class="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem @click="todoStore.toggleTodo(props.todo.id)">
            {{ props.todo.completed ? 'Mark as pending' : 'Mark as completed' }}
          </DropdownMenuItem>
          <RouterLink :to="`/todo/${props.todo.id}`">
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </RouterLink>
          <DropdownMenuSeparator />
          <Dialog v-model:open="isEditDialogOpen">
            <DialogTrigger as-child>
              <DropdownMenuItem @select.prevent>
                <PencilIcon class="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Todo</DialogTitle>
              </DialogHeader>
              <div class="py-4">
                <Input v-model="editedText" @keyup.enter="handleSaveChanges" />
              </div>
              <DialogFooter>
                <Button @click="handleSaveChanges">Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <DropdownMenuItem @select.prevent class="text-destructive focus:text-destructive">
                <TrashIcon class="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your todo.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction @click="todoStore.removeTodo(props.todo.id)">Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardHeader>
    <CardFooter class="flex-col items-start gap-2 pt-4">
      <div class="w-full border-t pt-4 flex items-center justify-between">
        <Badge :variant="props.todo.completed ? 'secondary' : 'default'">
          Status: {{ props.todo.completed ? 'Completed' : 'Pending' }}
        </Badge>
        <span class="text-xs text-muted-foreground">UserID: {{ props.todo.userId }}</span>
      </div>
    </CardFooter>
  </Card>
</template>