import { z } from "zod";
import { titleField, taskResponseSchema } from "./task.schema.js";

export const createTaskSchema = z.object({
  title: titleField,
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const createTaskResponseSchema = taskResponseSchema;