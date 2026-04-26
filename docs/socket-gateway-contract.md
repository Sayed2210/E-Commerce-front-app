# Socket Gateway Contract

Use this contract so frontend (`app/plugins/socket.client.ts`) and backend gateway stay aligned.

## Frontend -> Backend auth

- Transport: polling + websocket upgrade
- Auth token location: `handshake.headers.authorization` (`Bearer <token>`)

Frontend example:

```ts
socket = io(API_BASE_URL, {
  auth: { token }, // optional fallback for older gateways
  extraHeaders: { authorization: `Bearer ${token}` },
  transports: ['polling', 'websocket'],
  withCredentials: true,
})
```

Backend token read example:

```ts
const authorization = client.handshake.headers.authorization
const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined
```

## Event names

Keep event names exactly as below:

- `newNotification` -> push in-app notification
- `cart_updated` -> refresh cart state

## Backend gateway example

```ts
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { NotificationDto } from '../dto/notification.dto'

@WebSocketGateway({
  cors: {
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001'].filter(
      Boolean
    ),
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server

  constructor(private jwtService: JwtService) {}

  handleConnection(client: Socket) {
    try {
      const authorization = client.handshake.headers.authorization
      const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined

      if (!token) {
        throw new Error('Missing token')
      }

      const payload = this.jwtService.verify<{ sub?: string }>(token)
      if (!payload?.sub) {
        throw new Error('Invalid token payload')
      }

      client.data.userId = payload.sub
      void client.join(`user:${payload.sub}`)
    } catch {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId
    if (userId) {
      void client.leave(`user:${userId}`)
    }
  }

  sendNotification(userId: string, notification: NotificationDto) {
    this.server.to(`user:${userId}`).emit('newNotification', notification)
  }

  sendCartUpdate(userId: string, cart: unknown) {
    this.server.to(`user:${userId}`).emit('cart_updated', cart)
  }
}
```
