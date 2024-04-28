import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config({ path: ".env" });
connectDB();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvfkhelsx',
    api_key: process.env.CLOUDINARY_API_KEY || '519188859494886',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'lv9zrjEwonc_A5jsB8EZiyNJd28'
});


app.listen(process.env.PORT || 8000, () => {
    console.log(`server is running at http://localhost:${process.env.PORT}`);
})