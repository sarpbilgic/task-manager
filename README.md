## Task Management API 

A simple Task Management API built for the case study.  

You can test the API from the documentation. First request may take around 30 seconds to respond due to the cold start: 
https://task-manager-api-1zej.onrender.com/docs
or locally: http://localhost:3000/docs


## Tech Stack
- Node.js + Fastify
- TypeScript
- Validation: Zod
- ORM/DB (optional): Prisma + PostgreSQL
- API Docs (optional): OpenAPI + Scalar UI
- Testing (optional): Vitest
- Docker (optional)

---

## API
### Endpoints
- `POST /tasks` — Create task
- `GET /tasks` — List tasks 
- Extra:
  - `GET /tasks/:id`
  - `PATCH /tasks/:id`
  - `DELETE /tasks/:id`
  - `GET /health`

### Data Model
- `id: uuid`
- `title: string`
- `completed: boolean`
- `createdAt: date`

---

## Approach (How I built it)
- First I've planned the folder structure, determined the tech stack based on the requirements. I've made my decisions based on how I would do it on a real project.
- I split the code into layers to keep things organized, readable and loosely coupled:
  - routes = endpoints + schemas  
  - controllers = HTTP input/output  
  - service = logic + error mapping  
  - repository = Prisma calls only
- I got a database url from Neon to easily connect to the PostgreSQL database.
- Validation is done at the route level using Zod schemas.
- Centralized error handling with one Fastify error handler.

---

## Key Decisions
- Picked Fastify + TypeScript because it’s fast, typed, and easy to structure without too much boilerplate.
- Used Zod for validation so I can define request/response shapes in one place and get types + runtime checks together.
- Added extra endpoints for CRUD operations to make the API more complete.
- Added 'completed' filter to the GET /tasks endpoint
- Used a centralized error handler to map errors to HTTP status codes and return consistent JSON responses.
- Added OpenAPI docs and Scalar UI for easy manual testing.
- Dockerized the app and deployed it to Render.
- Wrote a simple CI workflow to run the unit tests and build the app.

---

## Challenges / Notes
- **Docker + Prisma build-time env**: Prisma generation can require env variables at build time.
  - Solution: ensure Prisma client generation doesn’t fail during Docker build (build-time vs runtime env separation).
- **Fastify validation errors**: To make sure validation errors return `400` instead of `500` I've added a custom error handler to the Fastify instance.
- **If it was a real project I would add a user model and authentication to add ownership to tasks. I would also add rate limiting to protect the API from abuse, pagination to possibility of a user having a lot of tasks and integration tests with a test db.

---

## AI Usage
- I used Cursor to integrate openapi documentation, write unit tests, docker-compose and make small refactorings

---

## Running Locally
### Environment Variables
`DATABASE_URL` is required.

Example:
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?sslmode=require"
PORT=3000### Install & Run
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev---

## Tests 
Unit tests are written with Vitest and mock the repository layer (no DB required).

npm test---

## CI
GitHub Actions runs on push/PR:
- unit tests
- TypeScript typecheck
- build

---

## Docker 
docker build -t task-manager .
docker run -p 3000:3000 -e DATABASE_URL="..." task-manager

