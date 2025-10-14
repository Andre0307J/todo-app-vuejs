<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useTodoStore } from "@/stores/todoStore";
import { useRouter } from "vue-router";

const todoStore = useTodoStore();
const router = useRouter();

function goToTodos() {
  // Clear existing todos to ensure a fresh fetch is triggered
  todoStore.clearTodos();
  router.push("/todos");
}
</script>

<template>
  <div class="flex h-[70vh] flex-col items-center justify-center gap-6 text-center">
    <h1 class="text-4xl font-bold tracking-tight md:text-5xl">Welcome to Todo App With Vue</h1>
    <p class="max-w-2xl text-lg text-muted-foreground">
      A modern, responsive, and fully-featured application to manage your daily tasks, migrated from
      React to Vue.
    </p>
    <p className="max-w-2xl text-lg text-muted-foreground">
      This project built on Vue.js framework, Tailwind CSS, and ShadCN/ui components and has a
      realtime chatting feature.
    </p>

    <p className="max-w-2xl text-lg text-muted-foreground">
      The tasks are fetched from the DummyJson API.
    </p>

    <div className="max-w-2xl text-lg text-muted-foreground">
      <p>Created by Ozomma Chukwuemeka Andre</p>
      <p>AltSchool ID: ALT/SOE/024/4767</p>
    </div>

    <Button size="lg" @click="goToTodos">Go to Todo List</Button>
  </div>
</template>
