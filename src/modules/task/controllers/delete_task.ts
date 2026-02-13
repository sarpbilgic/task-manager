import type { FastifyRequest, FastifyReply } from "fastify";
import type { TaskService } from "../task.service.js";

type DeleteTaskRequest = FastifyRequest<{Params: { id: string } }>;

export const deleteTaskController =
  (service: TaskService) =>
  async (request: DeleteTaskRequest, reply: FastifyReply) => {
    await service.deleteTask(request.params.id);
    return reply.status(204).send();
  };