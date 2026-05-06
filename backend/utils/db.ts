import mongoose from "mongoose";
require("dotenv").config();

const connectDB = async () => {
  try {
    let dbUrl: string = process.env.DB_URL || "";

    if (!dbUrl || dbUrl === "memory" || dbUrl === "undefined") {
      console.log("⚠️  DB_URL not found or set to memory. Starting local Memory DB server...");
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        dbUrl = mongoServer.getUri();
        console.log(`✅ [Memory DB] Started successfully at ${dbUrl}`);
      } catch (e: any) {
        console.error("❌ Failed to start Memory DB server:", e.message);
        throw e;
      }
    }

    console.log(`⏳ Attempting to connect to MongoDB at: ${dbUrl.split('@').pop()?.split('/')[0] || 'localhost'}...`);
    
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`✅ MongoDB Connected Successfully: ${data.connection.host}`);
    });
  } catch (error: any) {
    console.error("❌ MongoDB Connection Failed:", error.message);

    // If it's a DNS or connection error to Atlas, try falling back to memory DB in development
    if (
      process.env.NODE_ENV === "development" &&
      (error.message.includes("ENOTFOUND") || error.message.includes("ETIMEOUT") || error.message.includes("ECONNREFUSED"))
    ) {
      console.log("🔄 Detected DB connectivity issues. Attempting to start Memory DB as fallback...");
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        const memoryUri = mongoServer.getUri();
        await mongoose.connect(memoryUri);
        console.log(`✅ [Fallback Memory DB] Connected successfully at ${memoryUri}`);
        return;
      } catch (fallbackError: any) {
        console.error("❌ Memory DB fallback also failed:", fallbackError.message);
      }
    }

    console.log("🕒 Retrying MongoDB connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;