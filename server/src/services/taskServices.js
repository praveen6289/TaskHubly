import { v4 as uuid } from "uuid";
import { getDatabase } from "../config/database.js";

export async function createTask(title) {
  const task = {
    id: uuid(),
    title,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const database = getDatabase();

  await database.collection("tasks").insertOne(task);

  return task;
}

export async function getAllTasks() {
  const database = getDatabase();

  return await database.collection("tasks").find({}).toArray();
}

export async function getTaskById(id) {
  const database = getDatabase();

  return await database.collection("tasks").findOne({ id });
}

export async function updateTaskById(id, updates) {
  const database = getDatabase();

  const updateData = {
    ...updates,
    updatedAt: new Date(),
  };

  const result = await database
    .collection("tasks")
    .updateOne({ id }, { $set: updateData });

  if (result.matchedCount === 0) {
    return null;
  }

  return await getTaskById(id);
}

export async function deleteTaskById(id) {
  const database = getDatabase();

  const result = await database.collection("tasks").deleteOne({ id });

  if (result.deletedCount === 0) {
    return false;
  }

  return true;
}
