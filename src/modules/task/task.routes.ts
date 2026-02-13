import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createTaskController } from "./controllers/create_task.js";
import { deleteTaskController } from "./controllers/delete_task.js";
import { getTaskController, getTaskByIdController } from "./controllers/get_task.js";
import { updateTaskController } from "./controllers/update_task.js";
import { createTaskSchema, createTaskResponseSchema } from "./schemas/create_task.schema.js";
import { getTasksQuerySchema } from "./schemas/get_task.schema.js";
import { taskResponseSchema } from "./schemas/task.schema.js";
import { updateTaskSchema } from "./schemas/update_task.schema.js";
import { TaskRepository } from "./task.repository.js";
import { TaskService } from "./task.service.js";

export default async function taskRoutes(fastify: FastifyInstance) {
  const repository = new TaskRepository(fastify.prisma);
  const service = new TaskService(repository);

  fastify.post(
    "/",
    {
      schema: {
        description: "Create a new task",
        tags: ["Tasks"],
        body: createTaskSchema,
        response: {
          201: createTaskResponseSchema,
        },
      },
    },
    createTaskController(service)
  );

  fastify.get(
    "/",
    {
      schema: {
        description: "Get all tasks, optionally filtered by completion status",
        tags: ["Tasks"],
        querystring: getTasksQuerySchema,
        response: {
          200: z.array(taskResponseSchema),
        },
      },
    },
    getTaskController(service)
  );

  fastify.get(
    "/:id",
    {
      schema: {
        description: "Get a task by ID",
        tags: ["Tasks"],
        params: z.object({
          id: z.string().describe("Task UUID"),
        }),
        response: {
          200: taskResponseSchema,
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    getTaskByIdController(service)
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        description: "Update a task (partial update)",
        tags: ["Tasks"],
        params: z.object({
          id: z.string().describe("Task UUID"),
        }),
        body: updateTaskSchema,
        response: {
          200: taskResponseSchema,
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    updateTaskController(service)
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        description: "Delete a task",
        tags: ["Tasks"],
        params: z.object({
          id: z.string().describe("Task UUID"),
        }),
        response: {
          204: z.null(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    deleteTaskController(service)
  );
}


