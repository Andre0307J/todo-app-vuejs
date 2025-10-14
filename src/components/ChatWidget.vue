<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { XIcon } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const chatStore = useChatStore()
const newMessage = ref('')
const username = ref('User' + Math.floor(Math.random() * 1000)) // Simple random username
const chatContent = ref<HTMLElement | null>(null)

onMounted(() => {
  chatStore.connect()
})

onUnmounted(() => {
  chatStore.disconnect()
})

async function handleSendMessage() {
  if (!newMessage.value.trim()) return
  await chatStore.sendMessage(username.value, newMessage.value)
  newMessage.value = ''
}

// Watch for new messages and scroll to the bottom
watch(chatStore.messages, async () => {
  await nextTick()
  if (chatContent.value) {
    chatContent.value.scrollTop = chatContent.value.scrollHeight
  }
}, { deep: true })
</script>

<template>
  <Card v-if="props.isOpen" class="fixed bottom-20 right-4 z-50 w-80 shadow-lg">
    <CardHeader class="flex flex-row items-center justify-between">
      <CardTitle>Real-time Chat</CardTitle>
      <Button variant="ghost" size="icon" class="h-8 w-8" @click="emit('close')">
        <XIcon class="h-4 w-4" />
      </Button>
    </CardHeader>
    <CardContent ref="chatContent" class="h-80 overflow-y-auto space-y-4">
      <div v-for="(msg, index) in chatStore.messages" :key="index">
        <span class="font-bold">{{ msg.user }}:</span> {{ msg.text }}
      </div>
    </CardContent>
    <CardFooter>
      <form @submit.prevent="handleSendMessage" class="flex w-full items-center space-x-2">
        <Input v-model="newMessage" placeholder="Type a message..." />
        <Button type="submit">Send</Button>
      </form>
    </CardFooter>
  </Card>
</template>