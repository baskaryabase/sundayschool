import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../../models/User';
import ClassAssignment from '../../../../models/ClassAssignment';
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
      // Find all teachers assigned to this class
      const assignments = await ClassAssignment.findAll({
        where: {
          classId: id,
        },
        include: [
          {
            model: User,
            as: 'teacher',
            attributes: ['id', 'name', 'email'],
            where: {
              role: UserRole.TEACHER,
            },
          },
        ],
      });
      
      // Extract teacher data from assignments
      const teachers = assignments.map(assignment => {
        const plainAssignment = assignment.get({ plain: true });
        return plainAssignment.teacher;
      });
      
      return res.status(200).json(teachers);
    }
    
    if (req.method === 'POST') {
      const { teacherIds } = req.body;
      
      if (!teacherIds || !Array.isArray(teacherIds)) {
        return res.status(400).json({ message: 'Invalid teacherIds array' });
      }
      
      // Create assignments for each teacher
      const assignments = await Promise.all(
        teacherIds.map(async (teacherId) => {
          // Verify that the user is actually a teacher
          const teacher = await User.findOne({
            where: {
              id: teacherId,
              role: UserRole.TEACHER,
            },
          });
          
          if (!teacher) {
            return { teacherId, created: false, error: 'User is not a teacher' };
          }
          
          const [assignment, created] = await ClassAssignment.findOrCreate({
            where: {
              classId: id,
              userId: teacherId,
            },
            defaults: {
              assignedDate: new Date(),
              isPrimary: false, // Default to not primary teacher
            },
          });
          
          return { teacherId, created };
        })
      );
      
      return res.status(201).json(assignments);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

// Only admins can view and manage teacher assignments
export default withAuth(handler, [UserRole.ADMIN]);
