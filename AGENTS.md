# AI Agent Guide

## Project Overview
This is a Node.js (TypeScript) + Express.js microservice for image management. It handles image uploads, deduplication via SHA-256 hashing, and redundant storage using Cloudinary and ImgBB.

## Architecture
- **Framework:** Express.js
- **Database:** PostgreSQL (using `pg` driver)
- **Validation:** Zod
- **Containerization:** Docker & Docker Compose

## Directory Structure
- `/src/config`: Environment and Database configuration.
- `/src/controllers`: Express route handlers.
- `/src/routes`: API route definitions.
- `/src/services`: Business logic (Cloudinary, ImgBB, DB operations).
- `/src/utils`: Helper functions (Hashing, SSRF protection).

## Development Workflow
- `npm run dev`: Starts the server with `tsx` for hot-reloading.
- `npm run build`: Compiles TypeScript to `/dist`.
- `npm run start`: Runs the compiled JavaScript.

## Important Rules
- **SSRF Protection:** All URL-based uploads must pass through `validateUrlForSSRF` to prevent Server-Side Request Forgery.
- **Database Initialization:** The database schema is initialized automatically on server startup via `initDb()` in `src/config/db.ts`.
- **Environment Variables:** All new environment variables must be added to `src/config/env.ts` (Zod schema) and `.env.example`.
