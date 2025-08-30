import { NextApiRequest, NextApiResponse } from 'next';
import User from '../../../../../models/User';
import ClassEnrollment from '../../../../../models/ClassEnrollment';
import { withAuth } from '../../../../../lib/api-auth';
import { UserRole } from '../../../../../types/UserRole';

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
      // Find all students enrolled in this class
      const enrollments = await ClassEnrollment.findAll({
        where: {
          classId: id,
          role: UserRole.STUDENT,
        },
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
      
      // Extract student data from enrollments
      const students = enrollments.map(enrollment => {
        const plainEnrollment = enrollment.get({ plain: true });
        return plainEnrollment.student;
      });
      
      return res.status(200).json(students);
    }
    
    if (req.method === 'POST') {
      const { studentIds } = req.body;
      
      if (!studentIds || !Array.isArray(studentIds)) {
        return res.status(400).json({ message: 'Invalid studentIds array' });
      }
      
      // Create enrollments for each student
      const enrollments = await Promise.all(
        studentIds.map(async (studentId) => {
          const [enrollment, created] = await ClassEnrollment.findOrCreate({
            where: {
              classId: id,
              userId: studentId,
              role: UserRole.STUDENT,
            },
            defaults: {
              joinDate: new Date(),
            },
          });
          
          return { studentId, created };
        })
      );
      
      return res.status(201).json(enrollments);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

// Admins and teachers can view and manage student enrollments
export default withAuth(handler, [UserRole.ADMIN, UserRole.TEACHER]);
