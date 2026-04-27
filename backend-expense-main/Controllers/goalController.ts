import { Request, Response } from "express";
import { Goal } from "../models/goal";

// GET /api/goals
export const getGoals = async (req: Request, res: Response): Promise<void> => {
  try {

    const userId = req.user?.id;

     if (!userId) {
       res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const goals = await Goal.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/goals
export const createGoal = async (req: Request, res: Response): Promise<void> => {
  try {

    const userId = req.user?.id;
     if (!userId) {
       res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const {
      title,
      targetAmount,
      imageUrl,
      deadline
    } = req.body;

    const newGoal = await Goal.create({
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
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create goal"
    });
  }
};

// PUT /api/goals/:id
export const updateGoal = async (req: Request, res: Response): Promise<void> => {
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
    );

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