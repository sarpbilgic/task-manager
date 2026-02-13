import type { FastifyRequest, FastifyReply } from "fastify";
import type { TaskService } from "../task.service.js";
import type { UpdateTaskInput } from "../schemas/update_task.schema.js";

type UpdateTaskRequest = FastifyRequest<{ Params: { id: string }, Body: UpdateTaskInput }>;

export const updateTaskController =
  (service: TaskService) =>
  async (request: UpdateTaskRequest, reply: FastifyReply) => {
    const task = await service.updateTask(request.params.id, request.body);
    return reply.send(task);
  };
