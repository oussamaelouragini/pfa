"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGoal = exports.createGoal = exports.getGoals = void 0;
const goal_1 = require("../models/goal");
// GET /api/goals
const getGoals = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const goals = await goal_1.Goal.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: goals.length,
            data: goals
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getGoals = getGoals;
// POST /api/goals
const createGoal = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { title, targetAmount, imageUrl, deadline } = req.body;
        const newGoal = await goal_1.Goal.create({
            userId,
            title,
            targetAmount,
            imageUrl,
            deadline
        });
        res.status(201).json({
            success: true,
            data: newGoal
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create goal"
        });
    }
};
exports.createGoal = createGoal;
// PUT /api/goals/:id
const updateGoal = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const updates = req.body;
        // Allowed fields only
        const allowedFields = [
            "title",
            "targetAmount",
            "imageUrl",
            "deadline",
            "status"
        ];
        const filteredUpdates = {};
        Object.keys(updates).forEach((key) => {
            if (allowedFields.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        });
        const goal = await goal_1.Goal.findOneAndUpdate({ _id: id, userId }, filteredUpdates, { new: true, runValidators: true });
        if (!goal) {
            res.status(404).json({
                success: false,
                message: "Goal not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: goal
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to update goal"
        });
    }
};
exports.updateGoal = updateGoal;
//# sourceMappingURL=goalController.js.map