"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/categoryRoutes.ts
const express_1 = require("express");
const categoryController_1 = require("../Controllers/categoryController");
const JWT_1 = __importDefault(require("../middleware/JWT"));
const router = (0, express_1.Router)();
router.get("/", JWT_1.default, categoryController_1.getCategories);
router.post("/", JWT_1.default, categoryController_1.createCategory);
router.patch("/:id", JWT_1.default, categoryController_1.updateCategory);
router.delete("/:id", JWT_1.default, categoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map