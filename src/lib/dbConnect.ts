
import mongoose from "mongoose";


type connectionObject = {
    isConnected ?: number
}

const connection: connectionObject = {}

async function dbConnect(): Promise<void> {
    if(connection.isConnected){
        console.log("Already connected to database");
        return
    }

    try {
      if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI environment variable is not defined");
      }
      
      const db =  await mongoose.connect(process.env.MONGODB_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferCommands: false
      })
      connection.isConnected = db.connections[0].readyState
      console.log("Connected to database successfully");
        
    } catch (error) {
        console.error("Database connection failed:", error);
        connection.isConnected = 0;
        throw error;
    }
}
export default dbConnect;