"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const transRoute_1 = __importDefault(require("./routes/transRoute"));
const goalRoutes_1 = __importDefault(require("./routes/goalRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const upload_1 = require("./middleware/upload");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.DB_PORT || "5000", 10);
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
connectDB(); // call connectDB
app.use(cookieParser());
const ALLOWED_ORIGINS = [
    "http://localhost:8081",
    "http://localhost:8082",
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:8081$/,
    /^http:\/\/172\.\d{1,3}\.\d{1,3}\.\d{1,3}:8081$/,
    /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:8081$/,
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        const allowed = ALLOWED_ORIGINS.some((o) => typeof o === "string" ? o === origin : o.test(origin));
        if (allowed) {
            callback(null, true);
        }
        else {
            console.warn(`[CORS] Allowing non-whitelisted origin: ${origin}`);
            callback(null, true);
        }
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
// Serve uploaded files statically
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, 'uploads')));
app.get("/", (req, res) => {
    res.send("hello");
});
app.use("/auth", authRoutes_1.default);
app.use("/users", userRoutes_1.default);
app.use("/transactions", transRoute_1.default);
app.use("/goal", goalRoutes_1.default);
app.use("/categories", categoryRoutes_1.default);
app.use("/ai", aiRoutes_1.default);
// Global error handler — runs after all routes to catch multer and other errors
app.use((err, req, res, _next) => {
    const logMeta = { method: req.method, url: req.url, origin: req.headers.origin };
    if (err instanceof upload_1.MulterError) {
        console.error(`[MulterError] code=${err.code} field=${err.field}`, logMeta, err.message);
        if (err.code === "LIMIT_FILE_SIZE") {
            res.status(413).json({ success: false, message: "Image size exceeds 5 MB limit" });
            return;
        }
        res.status(400).json({ success: false, message: err.message });
        return;
    }
    if (err instanceof Error) {
        console.error(`[UploadError] ${err.message}`, logMeta, err.stack);
        res.status(400).json({ success: false, message: err.message });
        return;
    }
    console.error(`[UnknownError]`, logMeta, err);
    res.status(500).json({ success: false, message: "Server error" });
});
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