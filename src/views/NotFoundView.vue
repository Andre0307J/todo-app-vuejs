<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
    <img
      src="/404.jpg"
      alt="Page Not Found"
      class="h-auto w-full max-w-xs text-muted-foreground"
    />
    <Button as-child>
      <RouterLink to="/">Go back home</RouterLink>
    </Button>
  </div>
</template>