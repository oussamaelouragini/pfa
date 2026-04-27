import { Router } from "express";
import { getGoals,createGoal,updateGoal } from "../Controllers/goalController";
import verifyJWT from "../middleware/JWT";

const router = Router();

router.get("/goals", verifyJWT, getGoals);
router.post("/createGoals", verifyJWT, createGoal);
router.put("/goals/:id", verifyJWT, updateGoal);

export default router;