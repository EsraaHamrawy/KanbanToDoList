# KanbanToDoList

A simple Kanban-style task board built with React, Vite, Redux Toolkit, and a separate backend service.

## Run locally

- `npm run dev` starts both the Vite app and the backend together
- `npm run dev:client` starts only the frontend
- `npm run dev:server` starts only the backend

The backend lives in `backend/` and uses PostgreSQL via Prisma, so create/update/delete/drag-and-drop work reliably in production.

Backend env vars:
- `DATABASE_URL`
- `PORT`
- `CORS_ORIGIN`

If you deploy on Render, the included `render.yaml` provisions PostgreSQL and pushes the schema automatically.

For a separate production repo, commit Prisma migrations and run `npm run db:migrate:deploy` during build.

## Deploy on Render

This repo uses two services:

1. **API**: Web Service running the backend app in `backend/`
2. **Frontend**: Static Site running Vite build output

Use the included `render.yaml` to create both services automatically.

If you deploy them manually:
- API build command: `cd backend && npm install`
- API start command: `cd backend && npm start`
- Frontend build command: `npm install && npm run build`
- Frontend publish directory: `dist`
- Frontend env var: `VITE_API_URL=https://your-api-name.onrender.com`
