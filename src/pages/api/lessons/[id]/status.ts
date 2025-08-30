import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../../../lib/api-auth';
import Lesson from '../../../../../models/Lesson';
import { UserRole } from '../../../../../types/UserRole';

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
    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    if (req.method === 'PATCH') {
      // Check permissions - only the teacher who created it or admin can update
      if (
        req.session.user.role !== UserRole.ADMIN &&
        req.session.user.id !== lesson.teacherId
      ) {
        return res.status(403).json({ message: 'You do not have permission to update this lesson' });
      }

      const { status } = req.body;

      // Validate status
      if (!status || !['draft', 'published', 'archived'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      // Update the lesson status
      await lesson.update({ status });

      return res.status(200).json({ message: 'Lesson status updated successfully', status });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

// Teachers and admins can update lesson status
export default withAuth(handler, [UserRole.TEACHER, UserRole.ADMIN]);
