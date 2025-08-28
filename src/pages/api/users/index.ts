import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../models/User';
import { withAuth } from '../../../lib/api-auth';
import { UserRole } from '../../../models/User';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const users = await User.findAll({
        attributes: ['id', 'name', 'email', 'role', 'createdAt'],
        order: [['createdAt', 'DESC']],
      });
      
      return res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, password, role } = req.body;
      
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
      }

      // Create new user
      const user = await User.create({
        name,
        email,
        passwordHash: password, // This will be hashed by the User model's hook
        role,
      });

      // Return user without password
      const { passwordHash, ...userWithoutPassword } = user.toJSON();
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

export default withAuth(handler, [UserRole.ADMIN]);
