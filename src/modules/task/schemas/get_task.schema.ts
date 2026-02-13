import { z } from "zod";

export const getTasksQuerySchema = z.object({
  completed: z
    .string()
    .transform((val) => val === "true")
    .optional(),
});

export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;

