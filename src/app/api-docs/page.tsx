"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

const spec = {
  openapi: "3.0.0",
  info: {
    title: "Knowledge Hub API",
    version: "1.0.0",
    description:
      "API documentation for the Knowledge Hub backend with authentication, knowledge CRUD, file upload, AI Q&A, and conversation history.",
  },
  servers: [{ url: "/" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      KnowledgeItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          content: { type: "string" },
          fileUrl: { type: "string" },
          tags: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tag: { type: "object", properties: { name: { type: "string" } } },
              },
            },
          },
          userId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["name", "email", "password"],
              },
            },
          },
        },
        responses: {
          "201": { description: "User created" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        summary: "Login and receive a JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Authentication successful" },
          "400": { description: "Invalid credentials" },
        },
      },
    },
    "/api/auth/me": {
      get: {
        summary: "Get the current authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current user returned" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/api/knowledge": {
      get: {
        summary: "List knowledge items",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "tag", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Knowledge list returned" },
        },
      },
      post: {
        summary: "Create a knowledge item",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                  fileUrl: { type: "string" },
                },
                required: ["title", "content"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Knowledge created" },
        },
      },
    },
    "/api/knowledge/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      get: {
        summary: "Get a knowledge item",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Item returned" },
          "404": { description: "Not found" },
        },
      },
      put: {
        summary: "Update a knowledge item",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                  fileUrl: { type: "string" },
                },
                required: ["title", "content"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Item updated" },
          "403": { description: "Forbidden" },
        },
      },
      delete: {
        summary: "Delete a knowledge item",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Item deleted" },
          "403": { description: "Forbidden" },
        },
      },
    },
    "/api/upload": {
      post: {
        summary: "Upload a file",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Upload successful" },
        },
      },
    },
    "/api/ai": {
      post: {
        summary: "Ask AI about a knowledge item",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  knowledgeItemId: { type: "string" },
                  question: { type: "string" },
                },
                required: ["knowledgeItemId", "question"],
              },
            },
          },
        },
        responses: {
          "200": { description: "AI answer returned" },
        },
      },
    },
    "/api/conversations": {
      get: {
        summary: "Get AI conversation history",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "knowledgeItemId", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": { description: "Conversation history returned" },
        },
      },
    },
  },
};

export default function ApiDocs() {
  return <SwaggerUI spec={spec} />;
}