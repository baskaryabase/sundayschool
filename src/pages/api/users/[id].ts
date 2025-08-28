import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/User';
import { withAuth } from '../../../lib/api-auth';
import { UserRole } from '../../../models/User';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  if (req.method === 'GET') {
    try {
      const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
      });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, email, role } = req.body;
      
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user
      await user.update({
        name: name || user.name,
        email: email || user.email,
        role: role || user.role,
      });

      // Return user without sensitive data
      const { passwordHash, ...userWithoutPassword } = user.toJSON();
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.destroy();
      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting user:', error);
      return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default withAuth(handler, [UserRole.ADMIN]);
