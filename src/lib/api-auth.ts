import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/options';
import { UserRole } from '../types/UserRole';

type ApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void> | void;

export const withAuth = (handler: ApiHandler, allowedRoles: UserRole[] = []): ApiHandler => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role as UserRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    return handler(req, res);
  };
};
