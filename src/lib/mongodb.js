import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI; // Replace with your MongoDB URI

let cachedDb = null;

export async function connectToDatabase() {
    if (cachedDb) {
        console.log("Using cached database connection.");
        return cachedDb;
    }

    try {
        const db = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        cachedDb = db;
        console.log("Connected to MongoDB!");
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}
