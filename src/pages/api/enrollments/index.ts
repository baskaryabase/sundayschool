import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../lib/api-auth';
import ClassEnrollment from '../../../models/ClassEnrollment';
import Class from '../../../models/Class';
import User from '../../../models/User';
import ParentChild from '../../../models/ParentChild';
import { Op } from 'sequelize';
import { UserRole } from '../../../types/UserRole';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET - List enrollments based on filters
    if (req.method === 'GET') {
      const { classId, studentId, status } = req.query;
      
      const where: Record<string, unknown> = {};
      
      if (classId) where.classId = typeof classId === 'string' ? parseInt(classId) : classId;
      if (studentId) where.studentId = typeof studentId === 'string' ? parseInt(studentId) : studentId;
      if (status) where.status = status;
      
      // Check authorization:
      // 1. Admin/Teachers can see all enrollments
      // 2. Students can only see their own enrollments
      // 3. Parents can see their children's enrollments
      if (req.session.user.role === UserRole.STUDENT) {
        where.studentId = req.session.user.id;
      } else if (req.session.user.role === UserRole.PARENT) {
        // Get IDs of the parent's children
        const childrenRelationships = await ParentChild.findAll({
          where: { parentId: req.session.user.id },
          attributes: ['childId'],
        });
        
        const childIds = childrenRelationships.map(rel => rel.childId);
        
        if (childIds.length === 0) {
          return res.status(200).json([]);
        }
        
        where.studentId = { [Op.in]: childIds };
      }
      
      const enrollments = await ClassEnrollment.findAll({
        where,
        include: [
          {
            model: User,
            as: 'student',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: Class,
            attributes: ['id', 'name', 'gradeLevel', 'academicYear'],
          },
        ],
        order: [['enrollmentDate', 'DESC']],
      });
      
      return res.status(200).json(enrollments);
    }
    
    // POST - Create a new enrollment
    if (req.method === 'POST') {
      // Only admins and teachers can create enrollments
      if (![UserRole.ADMIN, UserRole.TEACHER].includes(req.session.user.role as UserRole)) {
        return res.status(403).json({ message: 'Not authorized to create enrollments' });
      }
      
      const { studentId, classId, status } = req.body;
      
      // Validate required fields
      if (!studentId || !classId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Check if the student and class exist
      const student = await User.findByPk(studentId);
      if (!student || student.role !== UserRole.STUDENT) {
        return res.status(400).json({ message: 'Invalid student ID' });
      }
      
      const classRecord = await Class.findByPk(classId);
      if (!classRecord) {
        return res.status(400).json({ message: 'Invalid class ID' });
      }
      
      // Check if the class is full
      if (classRecord.currentEnrollment >= classRecord.maxCapacity) {
        return res.status(400).json({ message: 'Class is at maximum capacity' });
      }
      
      // Check if the student is already enrolled in this class
      const existingEnrollment = await ClassEnrollment.findOne({
        where: { studentId, classId },
      });
      
      if (existingEnrollment) {
        return res.status(409).json({ message: 'Student is already enrolled in this class' });
      }
      
      // Create the enrollment
      const enrollment = await ClassEnrollment.create({
        studentId,
        classId,
        enrollmentDate: new Date(),
        status: status || 'active',
      });
      
      return res.status(201).json(enrollment);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

export default withAuth(handler);
