import { PrismaClient, Role, TaskStatus, TaskPriority, ProjectStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.attachment.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const member1 = await prisma.user.create({
    data: {
      email: 'member1@example.com',
      name: 'John Member',
      password: hashedPassword,
      role: Role.MEMBER,
    },
  });

  const member2 = await prisma.user.create({
    data: {
      email: 'member2@example.com',
      name: 'Jane Member',
      password: hashedPassword,
      role: Role.MEMBER,
    },
  });

  // Create Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'E-commerce App',
      description: 'Building a modern e-commerce platform with Next.js and Stripe.',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: ProjectStatus.ACTIVE,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Internal Dashboard',
      description: 'Analytics dashboard for company operations.',
      deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (overdue)
      status: ProjectStatus.ACTIVE,
    },
  });

  // Add Members
  await prisma.projectMember.createMany({
    data: [
      { projectId: project1.id, userId: admin.id, role: Role.ADMIN },
      { projectId: project1.id, userId: member1.id, role: Role.MEMBER },
      { projectId: project2.id, userId: admin.id, role: Role.ADMIN },
      { projectId: project2.id, userId: member2.id, role: Role.MEMBER },
    ],
  });

  // Create Tasks
  await prisma.task.createMany({
    data: [
      {
        projectId: project1.id,
        title: 'Setup Database',
        description: 'Initialize PostgreSQL and define Prisma schema.',
        priority: TaskPriority.HIGH,
        status: TaskStatus.DONE,
        assignedTo: admin.id,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project1.id,
        title: 'Auth Implementation',
        description: 'Implement JWT and Google OAuth.',
        priority: TaskPriority.HIGH,
        status: TaskStatus.IN_PROGRESS,
        assignedTo: member1.id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project1.id,
        title: 'Design UI Mockups',
        description: 'Create Figma designs for the landing page.',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.TODO,
        assignedTo: member1.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        projectId: project2.id,
        title: 'API Integration',
        description: 'Connect dashboard to external analytics API.',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        assignedTo: member2.id,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Overdue
      },
      {
        projectId: project2.id,
        title: 'User Feedback Survey',
        description: 'Collect initial feedback from beta testers.',
        priority: TaskPriority.LOW,
        status: TaskStatus.TODO,
        assignedTo: admin.id,
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
    ],
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
