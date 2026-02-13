import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 400
  ) {
    super(message);
    this.name = "AppError";
  }
}                                                                                                                                
                         
export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        message: error.message,                                     
      });
    }

    if (typeof error === "object" && error !== null && "validation" in error && error.validation) {
      return reply.status(400).send({
        message: "message" in error ? (error.message as string) : "Validation failed",
        details: error.validation,
      });
    }
                                  
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Validation failed",
        details: error.issues,
      });
    }

    return reply.status(500).send({
      message: "Internal server error",
    });
  });
}

