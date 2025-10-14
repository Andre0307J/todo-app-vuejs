import { ref } from 'vue'
import { defineStore } from 'pinia'
import Pusher from 'pusher-js'

export interface ChatMessage {
  user: string
  text: string
  timestamp: number
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const pusher = ref<Pusher | null>(null)

  function connect() {
    // Replace with your actual Pusher App Key and cluster
    pusher.value = new Pusher('e28e007ed4a981444f03', {
      cluster: 'eu',
    })

    const channel = pusher.value.subscribe('chat-channel')

    channel.bind('new-message', (data: ChatMessage) => {
      messages.value.push(data)
    })
  }

  function disconnect() {
    if (pusher.value) {
      pusher.value.disconnect()
      pusher.value = null
    }
  }

  async function sendMessage(user: string, text: string) {
    if (!text.trim()) return

    const message: ChatMessage = {
      user,
      text,
      timestamp: Date.now(),
    }

    // Optimistically add the message to the local state for immediate feedback.
    messages.value.push(message)

    // IMPORTANT: In a real application, you would send this message to your
    // own server endpoint, which would then trigger the Pusher event.
    // This prevents clients from broadcasting directly, which is a security risk.
    try {
      await fetch('/api/chat-message', { // This is a placeholder for your server endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      })
    }
    catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  return {
    messages,
    connect,
    disconnect,
    sendMessage,
  }
})