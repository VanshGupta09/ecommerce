import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
// import dotenv from "dotenv";

const app = express();

// dotenv.config({ path: ".env" });

app.use(
  cors({
    origin: true,
    credentials: true,
  }))
app.use(express.json({
  limit: "50mb"
}));
app.use(cookieParser());
// app.use(express.urlencoded({
//   extended: true,
//   }))
app.use(bodyParser.urlencoded({
  extended: true,
  // limit: "50mb"
}))
// app.use(express.static("public"))
app.use(fileUpload())


//importing routes
import product from "./src/routes/product.route.js";
import user from "./src/routes/user.route.js";
import order from "./src/routes/order.route.js";
import payment from "./src/routes/payment.route.js";

app.get("/", (req, res) => {
  res.status(200).send("Working!");
});

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
app.use("/api/v1", payment);

export default app;
