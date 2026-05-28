const express = require('express');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const createRedisClient = require('./config/redisClient');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');
const { authenticateSocket } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use(errorHandler);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

const redisUrl = process.env.REDIS_URL;
const redisClient = redisUrl ? createRedisClient() : null;
const { createAdapter } = require('@socket.io/redis-adapter');

const startBackend = async () => {
  if (redisClient) {
    try {
      const pubClient = redisClient;
      const subClient = redisClient.duplicate();
      await Promise.all([pubClient.connect(), subClient.connect()]);
      io.adapter(createAdapter(pubClient, subClient));
      console.log('Redis adapter connected');
    } catch (error) {
      console.warn('Redis adapter unavailable, continuing without Redis:', error.message || error);
    }
  } else {
    console.log('No Redis URL configured; running Socket.IO without Redis adapter');
  }

  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

startBackend();

io.use(authenticateSocket);

io.on('connection', (socket) => {
  const userId = socket.userId;
  if (userId) {
    socket.join(userId);
  }

  socket.on('sendMessage', ({ recipientId, content }) => {
    const message = { senderId: socket.userId, recipientId, content, createdAt: new Date() };
    io.to(recipientId).emit('receiveMessage', message);
    io.to(socket.userId).emit('receiveMessage', message);
  });

  socket.on('likePost', ({ postId, userId: likerId }) => {
    io.emit('postLiked', { postId, likerId });
  });

  socket.on('disconnect', () => {
    socket.leave(userId);
  });
});
