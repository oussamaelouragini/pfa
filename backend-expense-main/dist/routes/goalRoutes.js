"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const goalController_1 = require("../Controllers/goalController");
const JWT_1 = __importDefault(require("../middleware/JWT"));
const router = (0, express_1.Router)();
router.get("/goals", JWT_1.default, goalController_1.getGoals);
router.post("/createGoals", JWT_1.default, goalController_1.createGoal);
router.put("/goals/:id", JWT_1.default, goalController_1.updateGoal);
exports.default = router;
//# sourceMappingURL=goalRoutes.js.map