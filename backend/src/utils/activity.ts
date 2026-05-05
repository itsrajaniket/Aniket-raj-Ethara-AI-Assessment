import prisma from '../lib/prisma';

export const logActivity = async (projectId: string, userId: string, action: string, details?: string) => {
  try {
    await prisma.activityLog.create({
      data: {
        projectId,
        userId,
        action,
        details,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};
