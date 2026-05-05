import { Router, Response } from 'express';
import multer from 'multer';
import prisma from '../lib/prisma';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.middleware';
import { Role, TaskStatus, TaskPriority } from '@prisma/client';
import { logActivity } from '../utils/activity';
import path from 'path';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Get tasks for a project
router.get('/project/:projectId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: { assignee: { select: { id: true, name: true, avatarUrl: true } }, attachments: true },
      orderBy: { createdAt: 'desc' },
    });

    // Mark overdue tasks dynamically (logic check)
    const now = new Date();
    const updatedTasks = tasks.map(task => ({
      ...task,
      isOverdue: task.dueDate && new Date(task.dueDate) < now && task.status !== TaskStatus.DONE
    }));

    res.json(updatedTasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

// Create task
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, title, description, dueDate, priority, assignedTo } = req.body;
    
    // Check if user is project member or admin
    const isMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: req.user!.id } }
    });

    if (req.user!.role !== Role.ADMIN && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const task = await prisma.task.create({
      data: {
        projectId,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority as TaskPriority,
        assignedTo,
      },
    });

    await logActivity(projectId, req.user!.id, 'TASK_CREATED', `Created task: ${title}`);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
});

// Update task
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, status, assignedTo } = req.body;

    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return res.status(404).json({ message: 'Task not found' });

    // Only Admin or Assigned User or Member can update (depending on business rule)
    // Here: Admin or Member of project
    const isMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId: existingTask.projectId, userId: req.user!.id } }
    });

    if (req.user!.role !== Role.ADMIN && !isMember) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority: priority as TaskPriority,
        status: status as TaskStatus,
        assignedTo,
      },
    });

    await logActivity(existingTask.projectId, req.user!.id, 'TASK_UPDATED', `Updated task: ${title || existingTask.title}`);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// Delete task (Admin or creator/assignee?)
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user!.role !== Role.ADMIN) {
      return res.status(403).json({ message: 'Only admins can delete tasks' });
    }

    await prisma.task.delete({ where: { id } });
    await logActivity(task.projectId, req.user!.id, 'TASK_DELETED', `Deleted task: ${task.title}`);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
});

// File Attachment
router.post('/:id/attachments', authenticate, upload.single('file'), async (req: AuthRequest, res: Response) => {
  try {
    const { id: taskId } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const attachment = await prisma.attachment.create({
      data: {
        taskId,
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
      },
    });

    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ message: 'Error uploading attachment', error });
  }
});

export default router;
