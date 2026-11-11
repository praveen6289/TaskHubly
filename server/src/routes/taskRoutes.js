import { Router } from "express";

import {
    postTaskController,
    getAllTasksController,
    getTaskByIdController,
    updateTaskController,
    deleteTaskController
} from "../controllers/taskController.js";

const router = Router();

router.post("/", postTaskController);

router.get("/", getAllTasksController);

router.get("/:id", getTaskByIdController);

router.patch("/:id", updateTaskController);

router.delete("/:id", deleteTaskController);

export default router;