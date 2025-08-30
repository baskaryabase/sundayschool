import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../lib/api-auth';
import LessonPlan from '../../../models/LessonPlan';
import { UserRole } from '../../../types/UserRole';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // GET - Fetch all lesson plans
    if (req.method === 'GET') {
      const { classId } = req.query;
      
      const where: Record<string, unknown> = {};
      if (classId) {
        where.classId = typeof classId === 'string' ? parseInt(classId) : classId;
      }
      
      const lessonPlans = await LessonPlan.findAll({
        where,
        order: [['createdAt', 'DESC']],
      });
      
      return res.status(200).json(lessonPlans);
    }
    
    // POST - Create a new lesson plan
    if (req.method === 'POST') {
      const { 
        title, 
        description, 
        content, 
        bibleReference,
        keyPoints,
        objectives,
        duration,
        classId,
        status,
        publishDate,
        fileUrl 
      } = req.body;
      
      // Validate required fields
      if (!title || !description || !content || !classId || !bibleReference || !objectives) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Create the lesson plan
      const lessonPlan = await LessonPlan.create({
        title,
        description,
        content,
        bibleReference,
        keyPoints: Array.isArray(keyPoints) ? keyPoints : [],
        objectives,
        duration: duration || 45,
        status: status || 'draft',
        publishDate: publishDate || null,
        fileUrl: fileUrl || null,
        classId,
        createdBy: req.session.user.id,
      });
      
      return res.status(201).json(lessonPlan);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

// Only teachers and admins can create lesson plans
export default withAuth(handler, [UserRole.TEACHER, UserRole.ADMIN]);
