"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../Controllers/transactionController");
const transactionController_2 = require("../Controllers/transactionController");
const JWT_1 = __importDefault(require("../middleware/JWT"));
const router = (0, express_1.Router)();
router.get("/", JWT_1.default, transactionController_1.getTransactions);
router.get("/:id", JWT_1.default, transactionController_1.getTransactionById);
router.post("/", JWT_1.default, transactionController_2.createTransaction);
router.patch("/:id", JWT_1.default, transactionController_1.updateTransaction);
router.delete("/:id", JWT_1.default, transactionController_1.deleteTransaction);
exports.default = router;
//# sourceMappingURL=transRoute.js.map