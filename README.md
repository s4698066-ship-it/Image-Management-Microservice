# Image Management Microservice

A production-ready, Dockerized microservice for image uploads, deduplication (SHA-256), and redundant storage (Cloudinary + ImgBB).

## Features
- **Image Deduplication:** SHA-256 hashing to prevent redundant uploads.
- **Dual-Upload Strategy:** Concurrent upload to Cloudinary (Primary) and ImgBB (Fallback).
- **SSRF Protection:** Strict HTTPS validation and DNS-based private IP blocking for URL uploads.
- **Dockerized:** Multi-stage Dockerfile and Docker Compose setup.

## Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local development)

## Environment Variables
Copy `.env.example` to `.env` and fill in the required values:
```bash
cp .env.example .env
```
Required variables:
- `DATABASE_URL`
- `CLOUDINARY_URL`
- `IMGBB_API_KEY`

## Running with Docker (Recommended)
```bash
docker-compose up --build
```
This will start the PostgreSQL database and the Node.js application. The database will be initialized automatically.

## Local Development
1. Start a local PostgreSQL instance and update `DATABASE_URL` in `.env`.
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

## API Endpoints

### `GET /api/health`
Returns the health status of the service.

### `POST /api/upload`
Uploads an image via Base64 or URL.
**Payload:**
```json
{
  "base64": "data:image/png;base64,iVBORw0KGgo...",
  // OR
  "url": "https://example.com/image.jpg"
}
```

### `GET /api/images/:hash`
Retrieves image metadata by its SHA-256 hash.
