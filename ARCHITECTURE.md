# Knowledge Hub Architecture

## Overview

This project is a full-stack Knowledge Hub built with Next.js App Router. It provides:
- JWT-based authentication
- Knowledge item CRUD with tags, visibility, and file upload
- AI-powered question answering using OpenAI
- Conversation history persisted in the database
- Protected API routes and client dashboard UI

## Database Schema

### Models

- `User`
  - `id`, `name`, `email`, `passwordHash`, `role`
  - relations: `knowledgeItems`, `conversations`

- `KnowledgeItem`
  - `id`, `title`, `content`, `fileUrl`, `visibility`
  - relations: `user`, `tags`, `conversations`

- `Tag`
  - `id`, `name`
  - relation: `items`

- `KnowledgeTag`
  - join table for many-to-many relationship between `KnowledgeItem` and `Tag`

- `Conversation`
  - `id`, `userId`, `knowledgeItemId`, `question`, `answer`, `tokensUsed`, `modelUsed`

## Backend Framework Selection

- Next.js App Router for server-side API routes and frontend rendering
- Prisma ORM for PostgreSQL schema management and query safety
- JSON Web Token (JWT) authentication for sessionless protected APIs
- Cloudinary for file uploads and asset storage
- OpenAI for knowledge-aware AI chat

## API Design Approach

Endpoints are grouped around resources and authentication:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/knowledge`
- `POST /api/knowledge`
- `GET /api/knowledge/:id`
- `PUT /api/knowledge/:id`
- `DELETE /api/knowledge/:id`
- `POST /api/upload`
- `POST /api/ai`
- `GET /api/conversations`

APIs return a consistent JSON shape with `success`, `message`, and `data`.

## Authentication Strategy

- Passwords are hashed with `bcrypt`
- `jsonwebtoken` creates a signed JWT with a 7-day expiry
- `middleware.ts` protects authenticated routes before route handlers execute
- `GET /api/auth/me` validates the token and returns the user profile

## AI Integration

- OpenAI is used in `src/services/ai.service.ts`
- The selected knowledge item content is assembled into a prompt
- The app asks OpenAI to answer only from the selected knowledge
- AI responses are persisted in the `Conversation` table

## Frontend UX

- A single client dashboard handles login, registration, knowledge management, filters, pagination, and AI chat
- File uploads are handled by `POST /api/upload`
- AI questions use `/api/ai` and history is fetched from `/api/conversations`

## Deployment Notes

- Ensure `DATABASE_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, and Cloudinary credentials are set
- Run Prisma migrations before starting
- The app is ready to deploy as a single Next.js application with database connectivity
