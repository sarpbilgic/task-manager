import { PrismaClient } from "../../../generated/prisma/client.js";
import type { UpdateTaskInput } from "./schemas/update_task.schema.js";

export class TaskRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: { title: string }) {
    return this.prisma.task.create({ data });
  }

  findAll(completed?: boolean) {
    return this.prisma.task.findMany({
      ...(completed !== undefined && { where: { completed } }),
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: string) {
    return this.prisma.task.findUnique({ where: { id } });
  }

  update(id: string, data: UpdateTaskInput) {
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );
    return this.prisma.task.update({ where: { id }, data: updateData });
  }

  delete(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
