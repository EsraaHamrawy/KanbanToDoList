# KanbanToDoList

A simple Kanban-style task board built with React, Vite, Redux Toolkit, and json-server.

## Deploy API on Render

1. Create a new Web Service on Render from this repo.
2. Use the included `render.yaml` or set the start command to `npx json-server --watch db.json --host 0.0.0.0 --port $PORT`.
3. After deploy, copy the Render URL and set `VITE_API_URL` in Vercel to that URL.
