"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.DATABASE_URL);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
module.exports = connectDB;
//# sourceMappingURL=database.js.map