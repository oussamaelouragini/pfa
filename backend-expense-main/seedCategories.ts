import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "./models/categorie";
import { User } from "./models/users";

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("Connected to DB");

    // Check if categories exist
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log("Categories already exist, skipping seed");
      process.exit(0);
    }

    // Get or create a test user
    let user = await User.findOne({ email: "test@test.com" });
    if (!user) {
      user = new User({
        email: "test@test.com",
        password: "test123", // In real app, hash this
        name: "Test User",
      });
      await user.save();
      console.log("✅ Test user created");
    }

    const categories = [
      { userId: user._id, name: "Food", type: "expense", icon: "fast-food", color: "#FF6B6B", isDefault: true },
      { userId: user._id, name: "Transport", type: "expense", icon: "car", color: "#4ECDC4", isDefault: true },
      { userId: user._id, name: "Entertainment", type: "expense", icon: "game-controller", color: "#45B7D1", isDefault: true },
      { userId: user._id, name: "Salary", type: "income", icon: "cash", color: "#96CEB4", isDefault: true },
      { userId: user._id, name: "Freelance", type: "income", icon: "laptop", color: "#FFEAA7", isDefault: true },
    ];

    await Category.insertMany(categories);
    console.log("✅ Categories seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedCategories();
