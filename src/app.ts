import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import scalarFastifyPlugin from "@scalar/fastify-api-reference";
import { z } from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import prismaPlugin from "../plugins/prisma.js";
import { registerErrorHandler } from "./common/errors.js";
import taskRoutes from "./modules/task/task.routes.js";

export function buildApp() {
  const app = Fastify({ logger: true });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  registerErrorHandler(app);

  //CORS for documentation UI
  app.register(cors, {
    origin: ["https://task-manager-api-1zej.onrender.com", "http://localhost:3000"], 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  });

  app.register(swagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "Task Manager API",
        description: "RESTful API for managing tasks",
        version: "1.0.0",
      },
      servers: [
        {
          url: "https://task-manager-api-1zej.onrender.com",
          description: "Production server",
        },
        {
          url: "http://localhost:3000",
          description: "Development server",
        },
      ],
      tags: [
        {
          name: "Tasks",
          description: "Task management endpoints",
        },
        {
          name: "Health",
          description: "Health check endpoints",
        },
      ],
    },
    transform: jsonSchemaTransform,
  });

  app.register(scalarFastifyPlugin, {
    routePrefix: "/docs",
    configuration: {
      theme: "purple",
      layout: "modern",
    },
  });

  app.register(prismaPlugin);
  app.register(taskRoutes, { prefix: "/tasks" });
  
  app.get("/health", {
    schema: {
      description: "Health check endpoint",
      tags: ["Health"],
      response: {
        200: z.object({
          status: z.string(),
        }),
      },
    },
  }, async () => {
    return { status: "ok" };
  });

  return app;
}