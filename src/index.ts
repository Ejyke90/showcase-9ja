import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { registerHandlers } from './socket/handlers.js';

const PORT = Number(process.env.PORT ?? 3001);
const app = createApp();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', socket => {
  console.log(`[ws] connected: ${socket.id}`);
  registerHandlers(io, socket);
  socket.on('disconnect', () => console.log(`[ws] disconnected: ${socket.id}`));
});

httpServer.listen(PORT, () => {
  console.log(`🟢 Showcase Nigeria server running on http://localhost:${PORT}`);
});
