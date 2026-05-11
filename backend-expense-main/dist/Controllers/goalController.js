"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoal = exports.updateGoal = exports.createGoal = exports.getGoals = void 0;
const goal_1 = require("../models/goal");
const getGoals = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const goals = await goal_1.Goal.find({ userId })
            .populate("category", "name icon color")
            .sort({ createdAt: -1 });
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
const createGoal = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { name, duration, frequency, category, target } = req.body;
        if (!name || !duration || !frequency || !category || !target) {
            res.status(400).json({
                success: false,
                message: "All fields are required: name, duration, frequency, category, target"
            });
            return;
        }
        const newGoal = await goal_1.Goal.create({
            userId,
            name,
            duration,
            frequency,
            category,
            target
        });
        const populatedGoal = await goal_1.Goal.findById(newGoal._id).populate("category", "name icon color");
        res.status(201).json({
            success: true,
            data: populatedGoal
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
const updateGoal = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const updates = req.body;
        const allowedFields = ["name", "duration", "frequency", "category", "target"];
        const filteredUpdates = {};
        Object.keys(updates).forEach((key) => {
            if (allowedFields.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        });
        const goal = await goal_1.Goal.findOneAndUpdate({ _id: id, userId }, filteredUpdates, { new: true, runValidators: true }).populate("category", "name icon color");
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
const deleteGoal = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const goal = await goal_1.Goal.findOneAndDelete({ _id: id, userId });
        if (!goal) {
            res.status(404).json({
                success: false,
                message: "Goal not found"
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Goal deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete goal"
        });
    }
};
exports.deleteGoal = deleteGoal;
//# sourceMappingURL=goalController.js.map