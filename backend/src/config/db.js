import mongoose from 'mongoose';

export async function connectDB(uri) {
  const connectionUri = uri || process.env.MONGODB_URI;

  if (!connectionUri) {
    throw new Error('MONGODB_URI is not defined');
  }

  await mongoose.connect(connectionUri);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
