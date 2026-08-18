import mongoose from 'mongoose';
export async function connectDB(){if(!process.env.MONGODB_URI){console.log('MONGODB_URI not set: API will run without database.');return;} try{await mongoose.connect(process.env.MONGODB_URI);console.log('MongoDB connected');}catch(e){console.error('MongoDB connection failed:',e.message)}}
