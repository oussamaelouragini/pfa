import { Request, Response } from "express";
import { Goal } from "../models/goal";

export const getGoals = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const goals = await Goal.find({ userId })
      .populate("category", "name icon color")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createGoal = async (req: Request, res: Response): Promise<void> => {
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

    const newGoal = await Goal.create({
      userId,
      name,
      duration,
      frequency,
      category,
      target
    });

    const populatedGoal = await Goal.findById(newGoal._id).populate("category", "name icon color");

    res.status(201).json({
      success: true,
      data: populatedGoal
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create goal"
    });
  }
};

export const updateGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const updates = req.body;

    const allowedFields = ["name", "duration", "frequency", "category", "target"];

    const filteredUpdates: any = {};
    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId },
      filteredUpdates,
      { new: true, runValidators: true }
    ).populate("category", "name icon color");

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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update goal"
    });
  }
};

export const deleteGoal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const goal = await Goal.findOneAndDelete({ _id: id, userId });

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete goal"
    });
  }
};
