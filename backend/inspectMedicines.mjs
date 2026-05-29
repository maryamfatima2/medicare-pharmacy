import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Medicine from './models/Medicine.js';

dotenv.config();

const main = async () => {
  await connectDB();
  const total = await Medicine.countDocuments({});
  const active = await Medicine.countDocuments({ isActive: true });
  const sample = await Medicine.find({ isActive: true }).limit(3).lean();
  console.log(JSON.stringify({ total, active, sample }, null, 2));
  await mongoose.disconnect();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
