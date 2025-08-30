import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../../lib/api-auth';
import Lesson from '../../../../models/Lesson';
import Class from '../../../../models/Class';
import { UserRole } from '../../../../types/UserRole';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'Invalid lesson ID' });
  }

  try {
    // Find the lesson
    const lesson = await Lesson.findByPk(id, {
      include: [
        {
          model: Class,
          as: 'class',
          attributes: ['name'],
        },
      ],
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (req.method === 'GET') {
      // Format the lesson data
      const plainLesson = lesson.get({ plain: true });
      const formattedLesson = {
        ...plainLesson,
        className: plainLesson.class?.name || 'Unknown Class',
        teacherName: 'Assigned Teacher', // You would include actual teacher name from User model here
      };
      
      return res.status(200).json(formattedLesson);
    }

    if (req.method === 'PUT') {
      // Check permissions - only the teacher who created it or admin can update
      if (
        req.session.user.role !== UserRole.ADMIN &&
        req.session.user.id !== lesson.teacherId
      ) {
        return res.status(403).json({ message: 'You do not have permission to update this lesson' });
      }

      const {
        title,
        description,
        scripture,
        objectives,
        materials,
        content,
        activities,
        classId,
        scheduledDate,
        duration,
        status,
      } = req.body;

      // Validate required fields
      if (!title || !description || !scripture || !objectives || !content || !classId || !scheduledDate) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Update the lesson
      await lesson.update({
        title,
        description,
        scripture,
        objectives,
        materials: materials || '',
        content,
        activities: activities || '',
        classId,
        scheduledDate,
        duration: duration || 60,
        status: status || 'draft',
      });

      return res.status(200).json(lesson);
    }

    if (req.method === 'DELETE') {
      // Only admins can delete lessons
      if (req.session.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: 'You do not have permission to delete this lesson' });
      }

      await lesson.destroy();
      return res.status(204).end();
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

// Teachers and admins can access lesson details
export default withAuth(handler, [UserRole.TEACHER, UserRole.ADMIN]);
