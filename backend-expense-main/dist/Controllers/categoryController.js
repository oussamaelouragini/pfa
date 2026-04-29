"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const categorie_1 = require("../models/categorie");
const getCategories = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const categories = await categorie_1.Category.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({ data: categories });
    }
    catch (error) {
        console.error("❌ Get categories error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, icon, color } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (!name) {
            res.status(400).json({ message: "Category name is required" });
            return;
        }
        const existing = await categorie_1.Category.findOne({ userId, name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existing) {
            res.status(400).json({ message: "Category already exists" });
            return;
        }
        const category = new categorie_1.Category({
            userId,
            name,
            icon,
            color,
            isDefault: false,
        });
        const saved = await category.save();
        res.status(201).json({ message: "Category created", data: saved });
    }
    catch (error) {
        console.error("❌ Create category error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        const { name, icon, color } = req.body;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const category = await categorie_1.Category.findOne({ _id: id, userId });
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        if (category.isDefault) {
            res.status(403).json({ message: "Cannot update default category" });
            return;
        }
        if (name)
            category.name = name;
        if (icon)
            category.icon = icon;
        if (color)
            category.color = color;
        const updated = await category.save();
        res.status(200).json({ message: "Category updated", data: updated });
    }
    catch (error) {
        console.error("❌ Update category error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { id } = req.params;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const category = await categorie_1.Category.findOne({ _id: id, userId });
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        if (category.isDefault) {
            res.status(403).json({ message: "Cannot delete default category" });
            return;
        }
        await category.deleteOne();
        res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        console.error("❌ Delete category error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
exports.deleteCategory = deleteCategory;
//# sourceMappingURL=categoryController.js.map