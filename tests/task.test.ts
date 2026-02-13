import { describe, it, expect, vi } from "vitest";
import { TaskService } from "../src/modules/task/task.service.js";
import { TaskRepository } from "../src/modules/task/task.repository.js";
import { AppError } from "../src/common/errors.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Mock repository
const mockRepository = {
  create: vi.fn(),
  findAll: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
} as unknown as TaskRepository;

describe("TaskService", () => {
  const service = new TaskService(mockRepository);

  describe("createTask", () => {
    it("should create a task with valid title", async () => {
      const mockTask = {
        id: "123",
        title: "Test Task",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.create).mockResolvedValue(mockTask);

      const result = await service.createTask("Test Task");

      expect(mockRepository.create).toHaveBeenCalledWith({ title: "Test Task" });
      expect(result).toEqual(mockTask);
    });
  });

  describe("getTasks", () => {
    it("should return all tasks when no filter is provided", async () => {
      const mockTasks = [
        { id: "1", title: "Task 1", completed: false, createdAt: new Date(), updatedAt: new Date() },
        { id: "2", title: "Task 2", completed: true, createdAt: new Date(), updatedAt: new Date() },
      ];

      vi.mocked(mockRepository.findAll).mockResolvedValue(mockTasks);

      const result = await service.getTasks();

      expect(mockRepository.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual(mockTasks);
    });

    it("should filter tasks by completed status", async () => {
      const mockTasks = [
        { id: "1", title: "Task 1", completed: false, createdAt: new Date(), updatedAt: new Date() },
      ];

      vi.mocked(mockRepository.findAll).mockResolvedValue(mockTasks);

      const result = await service.getTasks(false);

      expect(mockRepository.findAll).toHaveBeenCalledWith(false);
      expect(result).toEqual(mockTasks);
    });
  });

  describe("getTaskById", () => {
    it("should return a task if found", async () => {
      const mockTask = {
        id: "123",
        title: "Test Task",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.findById).mockResolvedValue(mockTask);

      const result = await service.getTaskById("123");

      expect(mockRepository.findById).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockTask);
    });

    it("should throw AppError if task not found", async () => {
      vi.mocked(mockRepository.findById).mockResolvedValue(null);

      await expect(service.getTaskById("123")).rejects.toThrow(AppError);
      await expect(service.getTaskById("123")).rejects.toThrow("Task not found");
    });
  });

  describe("updateTask", () => {
    it("should update a task successfully", async () => {
      const mockTask = {
        id: "123",
        title: "Updated Task",
        completed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.update).mockResolvedValue(mockTask);

      const result = await service.updateTask("123", { completed: true });

      expect(mockRepository.update).toHaveBeenCalledWith("123", { completed: true });
      expect(result).toEqual(mockTask);
    });

    it("should throw AppError if task not found", async () => {
      const prismaError = new PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      vi.mocked(mockRepository.update).mockRejectedValue(prismaError);

      await expect(service.updateTask("123", { completed: true })).rejects.toThrow(AppError);
      await expect(service.updateTask("123", { completed: true })).rejects.toThrow("Task not found");
    });
  });

  describe("deleteTask", () => {
    it("should delete a task successfully", async () => {
      const mockTask = {
        id: "123",
        title: "Task to delete",
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(mockRepository.delete).mockResolvedValue(mockTask);

      const result = await service.deleteTask("123");

      expect(mockRepository.delete).toHaveBeenCalledWith("123");
      expect(result).toEqual(mockTask);
    });

    it("should throw AppError if task not found", async () => {
      const prismaError = new PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "5.0.0",
      });

      vi.mocked(mockRepository.delete).mockRejectedValue(prismaError);

      await expect(service.deleteTask("123")).rejects.toThrow(AppError);
      await expect(service.deleteTask("123")).rejects.toThrow("Task not found");
    });
  });
});

