import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models';

dotenv.config();

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/registration_db';

// Fix potential misconfiguration where URI starts with key name
if (MONGODB_URI.includes('=')) {
  MONGODB_URI = MONGODB_URI.split('=')[1];
}

console.log('URI used for connection:', MONGODB_URI);

async function setupDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'regUser@gmail.com';
    const adminPassword = 'StrongPass123';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists.');
    } else {
      const admin = new User({
        email: adminEmail,
        password: adminPassword, // Will be hashed by pre-save hook
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created successfully:', adminEmail);
    }

  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

setupDB();
