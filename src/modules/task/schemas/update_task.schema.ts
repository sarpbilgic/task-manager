import { z } from "zod";
import { titleField } from "./task.schema.js";

export const updateTaskSchema = z.object({
  title: titleField.optional(),
  completed: z.boolean().optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;