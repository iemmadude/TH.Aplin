import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB() {
  try {
    const db = await mongoose.connect(process.env.MONGOPSS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.onOpen('open', _ => {
    })

  } catch (e) {
    console.log(e);
  }
}