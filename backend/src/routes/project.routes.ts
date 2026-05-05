import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';
import { Role, ProjectStatus } from '@prisma/client';
import { logActivity } from '../utils/activity';

const router = Router();

// Get all projects (Admin sees all, Member sees joined)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    let projects;

    if (user.role === Role.ADMIN) {
      projects = await prisma.project.findMany({
        include: { members: { include: { user: true } }, _count: { select: { tasks: true } } },
      });
    } else {
      projects = await prisma.project.findMany({
        where: { members: { some: { userId: user.id } } },
        include: { members: { include: { user: true } }, _count: { select: { tasks: true } } },
      });
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// Create project (Admin only)
router.post('/', authenticate, authorize([Role.ADMIN]), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, deadline } = req.body;
    const project = await prisma.project.create({
      data: {
        name,
        description,
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    await logActivity(project.id, req.user!.id, 'PROJECT_CREATED', `Created project: ${name}`);

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
});

// Update project (Admin only)
router.put('/:id', authenticate, authorize([Role.ADMIN]), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, deadline, status } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
        deadline: deadline ? new Date(deadline) : undefined,
        status: status as ProjectStatus,
      },
    });

    await logActivity(id, req.user!.id, 'PROJECT_UPDATED', `Updated project details`);

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error });
  }
});

// Delete project (Admin only)
router.delete('/:id', authenticate, authorize([Role.ADMIN]), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({ where: { id } });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
});

// Manage Members (Admin only)
router.post('/:id/members', authenticate, authorize([Role.ADMIN]), async (req: AuthRequest, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const { userId, role } = req.body;

    const member = await prisma.projectMember.upsert({
      where: { projectId_userId: { projectId, userId } },
      update: { role },
      create: { projectId, userId, role },
    });

    await logActivity(projectId, req.user!.id, 'MEMBER_ADDED', `Added user to project with role ${role}`);

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error adding member', error });
  }
});

router.delete('/:id/members/:userId', authenticate, authorize([Role.ADMIN]), async (req: AuthRequest, res: Response) => {
  try {
    const { id: projectId, userId } = req.params;

    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId } },
    });

    await logActivity(projectId, req.user!.id, 'MEMBER_REMOVED', `Removed user from project`);

    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing member', error });
  }
});

// Get Activity Logs
router.get('/:id/activity', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const logs = await prisma.activityLog.findMany({
      where: { projectId: id },
      include: { user: { select: { name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity logs', error });
  }
});

export default router;
