import { Request, Response, NextFunction } from 'express';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import prisma from '../lib/prisma';
import { Role } from '@prisma/client';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: Role;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    console.log('Authenticating token...');
    // Verify Clerk session
    const session = await clerkClient.verifyToken(token);
    console.log('Token verified, User ID:', session.sub);
    const clerkUserId = session.sub;

    // Check if user exists in our DB, if not, sync from Clerk
    let user = await prisma.user.findUnique({
      where: { id: clerkUserId },
    });

    if (!user) {
      // Fetch user details from Clerk
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      
      user = await prisma.user.upsert({
        where: { email },
        update: { id: clerkUserId, avatarUrl: clerkUser.imageUrl },
        create: {
          id: clerkUserId,
          email,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email.split('@')[0],
          role: Role.MEMBER,
          avatarUrl: clerkUser.imageUrl,
        },
      });
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    console.error('Clerk Auth Error:', error);
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
};

export const authorize = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    next();
  };
};
