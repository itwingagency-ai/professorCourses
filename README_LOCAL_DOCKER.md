# LMS Local Docker Setup

This project runs locally using Docker with:

- Frontend: Next.js on port 3000
- Backend: Node/Express on port 8000
- MongoDB on port 27017
- Redis on port 6379

## 1. Requirements

Install and open Docker Desktop.

## 2. Environment files

Backend env:
`backend/.env.docker`
(Copy from example: `cp backend/.env.docker.example backend/.env.docker`)

Frontend env:
`frontend/.env.docker`
(Copy from example: `cp frontend/.env.docker.example frontend/.env.docker`)

Important frontend API URL:
`NEXT_PUBLIC_SERVER_API=http://localhost:8000/api/v1/`

Important backend local services:
`DB_URL=mongodb://mongo:27017/lms_local`
`REDIS_URL=redis://redis:6379`
`ORIGIN=http://localhost:3000`

## 3. Start project

From root folder:
```bash
docker compose up --build
```

Open frontend:
http://localhost:3000

Backend test:
http://localhost:8000/api/v1/get-courses
