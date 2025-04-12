// server.js
import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 3001 })

// Store subscriptions: { orderId: [ws1, ws2] }
const orderChannels = {}

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    const data = JSON.parse(msg)

    if (data.type === 'subscribe') {
      const { orderId } = data
      orderChannels[orderId] = orderChannels[orderId] || []
      orderChannels[orderId].push(ws)
      ws.orderId = orderId
      console.log(`Client subscribed to ${orderId}`)
    }

    if (data.type === 'update') {
      const { orderId, status, txHash } = data
      const subscribers = orderChannels[orderId] || []
      subscribers.forEach((client) => {
        client.send(JSON.stringify({ orderId, status, txHash }))
      })
      console.log(`Broadcast update for ${orderId}: ${status}`)
    }
  })

  ws.on('close', () => {
    if (ws.orderId && orderChannels[ws.orderId]) {
      orderChannels[ws.orderId] = orderChannels[ws.orderId].filter((c) => c !== ws)
    }
  })
})

console.log('WebSocket server running on ws://localhost:3001')
