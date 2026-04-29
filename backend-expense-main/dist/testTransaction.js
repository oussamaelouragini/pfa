"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const users_1 = require("./models/users");
const categorie_1 = require("./models/categorie");
dotenv_1.default.config();
const testTransaction = async () => {
    try {
        await mongoose_1.default.connect(process.env.DATABASE_URL);
        console.log("Connected to DB");
        // Get test user
        const user = await users_1.User.findOne({ email: "test@test.com" });
        if (!user) {
            console.log("❌ Test user not found");
            process.exit(1);
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ userInfo: { id: user._id, email: user.email } }, process.env.ACCESS_OTP_SECRET, { expiresIn: "1h" });
        console.log("✅ JWT Token created");
        // Get a category
        const category = await categorie_1.Category.findOne({ userId: user._id, type: "expense" });
        if (!category) {
            console.log("❌ No expense category found for user:", user._id);
            const allCats = await categorie_1.Category.find({ userId: user._id });
            console.log("Available categories:", allCats.length);
            process.exit(1);
        }
        // Test transaction data
        const transactionData = {
            type: "expense",
            categoryId: category._id,
            amount: 50,
            note: "Test transaction",
        };
        console.log("📤 Sending transaction data:", transactionData);
        console.log("🔑 With token:", token.substring(0, 20) + "...");
        // This would be the fetch call from frontend
        const response = await fetch("http://localhost:5000/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(transactionData),
        });
        const result = await response.json();
        console.log("📥 Response status:", response.status);
        console.log("📥 Response body:", result);
        if (response.ok) {
            console.log("✅ Transaction created successfully!");
        }
        else {
            console.log("❌ Transaction creation failed");
        }
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Test error:", error.message);
        process.exit(1);
    }
};
testTransaction();
//# sourceMappingURL=testTransaction.js.map