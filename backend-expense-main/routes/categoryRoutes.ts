// routes/categoryRoutes.ts
import { Router } from "express";
import { deleteCategory, getCategories, createCategory, updateCategory } from "../Controllers/categoryController";
import verifyJWT from "../middleware/JWT";

const router = Router();

router.get("/", verifyJWT, getCategories);
router.post("/", verifyJWT, createCategory);
router.patch("/:id", verifyJWT, updateCategory);
router.delete("/:id", verifyJWT, deleteCategory);

export default router;