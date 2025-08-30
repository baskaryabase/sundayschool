import { NextApiRequest, NextApiResponse } from 'next';
import Class from '../../../../models/Class';
import { withAuth } from '../../../../lib/api-auth';
import { UserRole } from '../../../../types/UserRole';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid class ID' });
  }

  try {
    if (req.method === 'GET') {
      // Find the class by ID
      const classData = await Class.findByPk(id);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      return res.status(200).json(classData);
    }
    
    if (req.method === 'PUT') {
      // Find the class by ID
      const classData = await Class.findByPk(id);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      // Update class with new values
      const {
        name,
        gradeLevel,
        description,
        academicYear,
        semester,
        maxCapacity,
        scheduleDay,
        scheduleTime,
        location,
      } = req.body;
      
      if (!name || !gradeLevel || !academicYear || !maxCapacity || !scheduleDay || !scheduleTime) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      await classData.update({
        name,
        gradeLevel,
        description,
        academicYear,
        semester,
        maxCapacity,
        scheduleDay,
        scheduleTime,
        location,
      });
      
      return res.status(200).json(classData);
    }
    
    if (req.method === 'DELETE') {
      // Find the class by ID
      const classData = await Class.findByPk(id);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      // Delete the class
      await classData.destroy();
      
      return res.status(204).end();
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

// Only admins can modify classes (PUT, DELETE), but anyone can view them (GET)
export default withAuth(handler, []);
