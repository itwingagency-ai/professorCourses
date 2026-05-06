import mongoose from "mongoose";
require("dotenv").config();

const connectDB = async() => {
    try {
        let dbUrl: string = process.env.DB_URL || '';
        
        // Fallback to memory server if DB_URL is missing, set to 'memory', 
        // or if we detect a connection failure to Atlas (handled in catch)
        if (!dbUrl || dbUrl === 'memory' || dbUrl === 'undefined') {
            console.log("Starting local Memory DB server...");
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            dbUrl = mongoServer.getUri();
            console.log(`[Memory DB] Started successfully at ${dbUrl}`);
        }

        await mongoose.connect(dbUrl).then((data:any) => {
            console.log(`Database connected with ${data.connection.host}`)
        });
    } catch (error:any) {
        console.log("Database connection failed:", error.message);
        
        // If it's a DNS or connection error to Atlas, try falling back to memory DB
        if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEOUT')) {
            console.log("Detected remote DB connectivity issues. Attempting to start Memory DB as fallback...");
            try {
                const { MongoMemoryServer } = require('mongodb-memory-server');
                const mongoServer = await MongoMemoryServer.create();
                const memoryUri = mongoServer.getUri();
                await mongoose.connect(memoryUri);
                console.log(`[Fallback Memory DB] Connected successfully at ${memoryUri}`);
                return; // Exit retry loop if fallback succeeded
            } catch (fallbackError: any) {
                console.log("Memory DB fallback also failed:", fallbackError.message);
            }
        }
        
        console.log("Retrying database connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;