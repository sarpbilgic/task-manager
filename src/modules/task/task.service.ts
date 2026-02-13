import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AppError } from "../../common/errors.js";
import { TaskRepository } from "./task.repository.js";
import type { UpdateTaskInput } from "./schemas/update_task.schema.js";

export class TaskService {
  constructor(private repository: TaskRepository) {}

  async createTask(title: string) {
    return this.repository.create({ title });
  }

  async getTasks(completed?: boolean) {
    return this.repository.findAll(completed);
  }

  async getTaskById(id: string) {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    return task;
  }

  async updateTask(id: string, data: UpdateTaskInput) {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
        throw new AppError("Task not found", 404);
      }
      throw error;
    }
  }

  async deleteTask(id: string) {
    try {
      return await this.repository.delete(id);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
        throw new AppError("Task not found", 404);
      }
      throw error;
    }
  }
}
