import type { FastifyRequest, FastifyReply } from "fastify";
import type { TaskService } from "../task.service.js";
import type { GetTasksQuery } from "../schemas/get_task.schema.js";

type GetTasksRequest = FastifyRequest<{
  Querystring: GetTasksQuery;
}>;

type GetTaskByIdRequest = FastifyRequest<{
  Params: { id: string };
}>;

export const getTaskController =
  (service: TaskService) =>
  async (request: GetTasksRequest, reply: FastifyReply) => {
    const tasks = await service.getTasks(request.query.completed);
    return reply.send(tasks);
  };

export const getTaskByIdController =
  (service: TaskService) =>
  async (request: GetTaskByIdRequest, reply: FastifyReply) => {
    const task = await service.getTaskById(request.params.id);
    return reply.send(task);
  };