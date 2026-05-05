# Aura - Project & Task Management System

A premium full-stack project management application with RBAC, Clerk Auth, and real-time task tracking.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), Clerk Auth, Axios, Lucide React
- **Backend**: Node.js, Express, Clerk Node SDK, Prisma ORM
- **Database**: PostgreSQL (Supabase/Local)
- **Authentication**: Clerk (Global Session Management)

## Setup Instructions

### 1. Configure Environment
- Update `backend/.env` with your `DATABASE_URL`, `CLERK_SECRET_KEY`, and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
- Update `frontend/.env.local` with your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.

### 2. Run the App (Monorepo Mode)
From the root directory:
```bash
# Clean up any stuck processes
npm run clean

# Install everything
npm install

# Push database schema
cd backend
npx prisma db push
cd ..

# Run both Backend & Frontend together
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## Features
- **RBAC**: Admin and Member roles.
- **Projects**: Create, manage, and assign members (Admins).
- **Tasks**: Kanban board with status tracking and priorities.
- **Dashboard**: Real-time stats and project monitoring.
- **Audit Logs**: Traceable project activity.
