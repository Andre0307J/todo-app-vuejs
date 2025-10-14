<script setup lang="ts">
import { Input } from '@/components/ui/input/index'

defineProps<{
  modelValue?: string
}>()
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <Input
    :model-value="modelValue"
    type="text"
    placeholder="e.g. Finish the Vue migration"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>