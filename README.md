# KanbanToDoList

A simple Kanban-style task board built with React, Vite, Redux Toolkit, and json-server.

## Run locally

- `npm run dev` starts both the Vite app and json-server together
- `npm run dev:client` starts only the frontend
- `npm run dev:server` starts only the API

## Deploy on Render

This repo uses two services:

1. **API**: Web Service running `json-server`
2. **Frontend**: Static Site running Vite build output

Use the included `render.yaml` to create both services automatically.

If you deploy them manually:
- API build command: `npm install`
- API start command: `npm start`
- Frontend build command: `npm install && npm run build`
- Frontend publish directory: `dist`
- Frontend env var: `VITE_API_URL=https://your-api-name.onrender.com`
