import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { TaskStatus, Role } from '@prisma/client';

const router = Router();

router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const now = new Date();

    // 1. Total tasks by status (for user's projects)
    const userProjects = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true }
    });
    const projectIds = userProjects.map(p => p.projectId);

    // If Admin, they see stats for EVERYTHING? 
    // Usually dashboard is personal. Let's make it contextual.
    const whereClause = req.user!.role === Role.ADMIN ? {} : { projectId: { in: projectIds } };

    const statusCounts = await prisma.task.groupBy({
      by: ['status'],
      where: whereClause,
      _count: { id: true }
    });

    // 2. Overdue tasks
    const overdueTasks = await prisma.task.findMany({
      where: {
        ...whereClause,
        dueDate: { lt: now },
        status: { not: TaskStatus.DONE }
      },
      include: { project: { select: { name: true } } }
    });

    // 3. Tasks assigned to current user
    const assignedTasks = await prisma.task.findMany({
      where: { assignedTo: userId, status: { not: TaskStatus.DONE } },
      include: { project: { select: { name: true } } }
    });

    // 4. Per-project progress
    const projectsWithTasks = await prisma.project.findMany({
      where: req.user!.role === Role.ADMIN ? {} : { id: { in: projectIds } },
      include: {
        tasks: {
          select: { status: true }
        }
      }
    });

    const projectProgress = projectsWithTasks.map(project => {
      const total = project.tasks.length;
      const done = project.tasks.filter(t => t.status === TaskStatus.DONE).length;
      return {
        id: project.id,
        name: project.name,
        progress: total > 0 ? Math.round((done / total) * 100) : 0,
        totalTasks: total,
        doneTasks: done
      };
    });

    res.json({
      statusCounts: statusCounts.reduce((acc: any, curr) => {
        acc[curr.status] = curr._count.id;
        return acc;
      }, { TODO: 0, IN_PROGRESS: 0, DONE: 0 }),
      overdueCount: overdueTasks.length,
      overdueTasks,
      assignedTasks,
      projectProgress
    });

  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error });
  }
});

export default router;
