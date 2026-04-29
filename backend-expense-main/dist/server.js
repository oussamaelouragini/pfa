"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const transRoute_1 = __importDefault(require("./routes/transRoute"));
const goalRoutes_1 = __importDefault(require("./routes/goalRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.DB_PORT || "5000", 10);
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
connectDB(); // call connectDB
app.use(cookieParser());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:8081", "http://192.168.1.102:8081"], // Add your machine IP
    credentials: true,
}));
app.get("/", (req, res) => {
    res.send("hello");
});
app.use("/auth", authRoutes_1.default);
app.use("/transactions", transRoute_1.default);
app.use("/goal", goalRoutes_1.default);
app.use("/categories", categoryRoutes_1.default);
mongoose_1.default.connection.once("open", () => {
    console.log("Connected to database");
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
mongoose_1.default.connection.on("error", (err) => {
    console.error(err);
});
//# sourceMappingURL=server.js.map