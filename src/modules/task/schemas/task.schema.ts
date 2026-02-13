import { z } from "zod";

export const titleField = z.string().trim().min(1, "Title cannot be empty");

export const taskResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TaskResponse = z.infer<typeof taskResponseSchema>;

