import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
};

module.exports = connectDB;