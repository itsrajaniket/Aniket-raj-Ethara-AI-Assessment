# Aura - Project & Task Management System

A premium full-stack project management application with RBAC, Google OAuth, and real-time task tracking.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Clerk Auth, Axios, Lucide React
- **Backend**: Node.js, Express, Clerk Node SDK, Prisma ORM
- **Database**: PostgreSQL (Supabase/Local)
- **Authentication**: Clerk (Global Session Management)

## Features
- **RBAC**: Admin and Member roles.
- **Projects**: Create, manage, and assign members to projects (Admins).
- **Tasks**: Kanban-style task board with priority, due dates, and status tracking.
- **Dashboard**: Real-time stats, overdue task monitoring, and project progress.
- **Audit Logs**: Every major action in a project is logged for transparency.
- **File Attachments**: Upload files to tasks.
- **Modern UI**: Dark mode, glassmorphism, and smooth transitions.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- PostgreSQL

### 1. Database Setup
Ensure you have a PostgreSQL database running. Update the `DATABASE_URL` in `backend/.env`.

### 2. Backend Setup
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```

### 3. Frontend Setup
Update the `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `frontend/.env.local` (if using Google Login).
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login/Signup with Google

### Projects
- `GET /api/projects` - List projects (Context-aware)
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)
- `GET /api/projects/:id/activity` - Fetch activity logs

### Tasks
- `GET /api/tasks/project/:projectId` - Fetch tasks for a project
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task status/details
- `POST /api/tasks/:id/attachments` - Upload file to task

### Dashboard
- `GET /api/dashboard/stats` - Fetch overall stats and user-specific tasks

## Sample Credentials
- **Admin**: `admin@example.com` / `password123`
- **Member**: `member1@example.com` / `password123`
