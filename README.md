# Documentation Portal

A full-stack Knowledge Hub built with Next.js, Prisma, PostgreSQL, JWT authentication, Cloudinary file storage, and OpenAI-powered knowledge-aware chat.

## Features

- User registration, login, and JWT-protected API routes
- Knowledge item creation, editing, deletion, tagging, visibility controls
- Search, pagination, and filtering by visibility or tag
- File upload support via Cloudinary
- AI question answering based on selected knowledge content
- Conversation history persisted in the database
- Swagger-based API documentation

## Getting Started

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Update `.env` values:
- `DATABASE_URL`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

3. Install dependencies:

```bash
npm install
```

4. Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

5. Start the development server:

```bash
npm run dev
```

6. Open the app in your browser:

```text
http://localhost:3000
```

## API Documentation

Visit `/api-docs` in the browser to explore the Swagger UI for all endpoints.

## Architecture

See `ARCHITECTURE.md` for the system design, database schema, authentication strategy, AI integration, and deployment notes.

## Notes

- Authentication is JWT-based and protected by `src/middleware.ts`.
- File uploads are handled via `src/app/api/upload/route.ts` and stored with Cloudinary.
- AI-powered responses use OpenAI via `src/services/ai.service.ts`.
- Knowledge items support private/team visibility and tag-based filtering.
