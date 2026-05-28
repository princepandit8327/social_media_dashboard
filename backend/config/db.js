const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (uri) {
      const conn = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    }

    const mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    const conn = await mongoose.connect(memoryUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Memory Server started at ${memoryUri}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
