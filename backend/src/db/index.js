import mongoose from "mongoose";
import { DbName } from "../../constant.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DbName}`);
        console.log(`DB connected ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("connection error: " + error);
        process.exit(1);
    }
}

export default connectDB;