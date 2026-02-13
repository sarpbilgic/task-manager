import type { FastifyRequest, FastifyReply } from "fastify";
import type { CreateTaskInput } from "../schemas/create_task.schema.js";
import type { TaskService } from "../task.service.js";

type CreateTaskRequest = FastifyRequest<{
  Body: CreateTaskInput;
}>;

export const createTaskController =
  (service: TaskService) =>
  async (request: CreateTaskRequest, reply: FastifyReply) => {
    const task = await service.createTask(request.body.title);
    return reply.code(201).send(task);
  };