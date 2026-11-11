import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from "../services/taskServices.js";

export async function postTaskController(req, res) {
  const { title } = req.body ?? {};

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      status: "error",
      message: "Task title is required",
    });
  }

  const task = await createTask(title.trim());

  return res.status(201).json({
    status: "success",
    message: "Task created successfully",
    data: task,
  });
}

export async function getAllTasksController(req, res) {
  const tasks = await getAllTasks();

  return res.status(200).json({
    status: "success",
    data: tasks,
  });
}

export async function getTaskByIdController(req, res) {
  const task = await getTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({
      status: "error",
      message: "Task not found",
    });
  }

  return res.status(200).json({
    status: "success",
    data: task,
  });
}

export async function updateTaskController(req, res) {
  const updates = req.body;

  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    return res.status(400).json({
      status: "error",
      message: "Invalid request body",
    });
  }

  const allowedFields = ["title", "completed"];
  const fields = Object.keys(updates);

  if (
    fields.length === 0 ||
    fields.some((field) => !allowedFields.includes(field))
  ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or missing update fields",
    });
  }

  if (
    "title" in updates &&
    (typeof updates.title !== "string" || !updates.title.trim())
  ) {
    return res.status(400).json({
      status: "error",
      message: "Title must be a non-empty string",
    });
  }

  if ("completed" in updates && typeof updates.completed !== "boolean") {
    return res.status(400).json({
      status: "error",
      message: "Completed must be a boolean",
    });
  }

  const normalizedUpdates = { ...updates };

  if (normalizedUpdates.title !== undefined) {
    normalizedUpdates.title = normalizedUpdates.title.trim();
  }

  const task = await updateTaskById(req.params.id, normalizedUpdates);

  if (!task) {
    return res.status(404).json({
      status: "error",
      message: "Task not found",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Task updated successfully",
    data: task,
  });
}

export async function deleteTaskController(req, res) {
  const deleted = await deleteTaskById(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      status: "error",
      message: "Task not found",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Task deleted successfully",
  });
}
