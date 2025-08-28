import { NextApiRequest, NextApiResponse } from 'next';
import Class from '../../../models/Class';
import { withAuth } from '../../../lib/api-auth';
import { UserRole } from '../../../models/User';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      const classes = await Class.findAll({
        order: [['gradeLevel', 'ASC'], ['name', 'ASC']],
      });
      
      return res.status(200).json(classes);
    }

    if (req.method === 'POST') {
      const { name, gradeLevel } = req.body;
      
      if (!name || !gradeLevel) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newClass = await Class.create({
        name,
        gradeLevel,
      });

      return res.status(201).json(newClass);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

// Only admins can create classes, but anyone can view them
export default withAuth(handler, []);
