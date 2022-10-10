import express from "express";
import fileUpload from "express-fileupload";
import { connectDB } from "./connection.js";
import cors from "cors";
import dotenv from "dotenv";
import ordenRoutes from "./src/routes/ordenRoutes.js"

dotenv.config();

const port = process.env.PORT || 3001;
const host = process.env.HOST || "0.0.0.0";
export const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGOPSS;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./upload",
  })
);
app.use(cors());
app.use(ordenRoutes)

connectDB();
app.listen(port, host, () => {
  console.log("Server listening on port", port);
});