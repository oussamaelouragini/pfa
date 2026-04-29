"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const categorie_1 = require("./models/categorie");
const users_1 = require("./models/users");
dotenv_1.default.config();
const seedCategories = async () => {
    try {
        await mongoose_1.default.connect(process.env.DATABASE_URL);
        console.log("Connected to DB");
        // Check if categories exist
        const count = await categorie_1.Category.countDocuments();
        if (count > 0) {
            console.log("Categories already exist, skipping seed");
            process.exit(0);
        }
        // Get or create a test user
        let user = await users_1.User.findOne({ email: "test@test.com" });
        if (!user) {
            user = new users_1.User({
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
        await categorie_1.Category.insertMany(categories);
        console.log("✅ Categories seeded successfully");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Seed error:", error);
        process.exit(1);
    }
};
seedCategories();
//# sourceMappingURL=seedCategories.js.map