import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

let isConnecting = false;

const connectionOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 50,
  minPoolSize: 5,
  retryWrites: true,
};

const registerConnectionEvents = () => {
  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected successfully');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
  });
};

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) return mongoose.connection;

  isConnecting = true;
  registerConnectionEvents();

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    isConnecting = false;
    console.error(`❌ Initial MongoDB Connection Error: ${error.message}`);
    console.log('🔄 Retrying connection in 5 seconds...');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return connectDB();
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
};

export default connectDB;
