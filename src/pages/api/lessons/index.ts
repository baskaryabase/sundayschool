import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../lib/api-auth';
import Lesson from '../../../models/Lesson';
import Class from '../../../models/Class';
import { UserRole } from '../../../types/UserRole';
import { initLessonsTable } from '../../../models/initLessons';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      try {
        // Initialize the Lessons table and its associations
        await initLessonsTable();
        
        // Get all lessons, first try without include to check if basic query works
        const lessons = await Lesson.findAll({
          order: [['scheduledDate', 'DESC']],
        });
        
        // Format the lessons with placeholder data for class and teacher
        const formattedLessons = lessons.map(lesson => {
          const plainLesson = lesson.get({ plain: true });
          return {
            ...plainLesson,
            className: 'Unknown Class', // Placeholder
            teacherName: 'Assigned Teacher', // Placeholder
          };
        });
        
        return res.status(200).json(formattedLessons);
      } catch (error) {
        console.error('Error in GET /api/lessons:', error);
        return res.status(500).json({ 
          message: 'Error fetching lessons', 
          error: (error as Error).message,
          stack: (error as Error).stack 
        });
      }
    }

    if (req.method === 'POST') {
      const {
        title,
        description,
        scripture,
        objectives,
        materials,
        content,
        activities,
        classId,
        teacherId,
        scheduledDate,
        duration,
        status,
      } = req.body;
      
      // Validate required fields
      if (!title || !description || !scripture || !objectives || !content || !classId || !scheduledDate) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newLesson = await Lesson.create({
        title,
        description,
        scripture,
        objectives,
        materials: materials || '',
        content,
        activities: activities || '',
        classId,
        teacherId: teacherId || req.session.user.id, // Default to current user if not specified
        scheduledDate,
        duration: duration || 60,
        status: status || 'draft',
      });

      return res.status(201).json(newLesson);
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

// Teachers and admins can create and view lessons
export default withAuth(handler, [UserRole.TEACHER, UserRole.ADMIN]);
