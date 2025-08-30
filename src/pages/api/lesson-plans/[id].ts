import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../lib/api-auth';
import LessonPlan from '../../../models/LessonPlan';
import LessonMaterial from '../../../models/LessonMaterial';
import { UserRole } from '../../../types/UserRole';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid lesson plan ID' });
  }

  try {
    // GET - Fetch a specific lesson plan
    if (req.method === 'GET') {
      const lessonPlan = await LessonPlan.findByPk(id, {
        include: [
          {
            model: LessonMaterial,
            as: 'materials',
            attributes: ['id', 'title', 'type', 'url', 'sortOrder', 'isRequired'],
            order: [['sortOrder', 'ASC']],
          },
        ],
      });
      
      if (!lessonPlan) {
        return res.status(404).json({ message: 'Lesson plan not found' });
      }
      
      return res.status(200).json(lessonPlan);
    }
    
    // PUT - Update a lesson plan
    if (req.method === 'PUT') {
      const lessonPlan = await LessonPlan.findByPk(id);
      
      if (!lessonPlan) {
        return res.status(404).json({ message: 'Lesson plan not found' });
      }
      
      // Check if the user is the creator of the lesson plan or an admin
      if (lessonPlan.createdBy !== req.session.user.id && req.session.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: 'Not authorized to update this lesson plan' });
      }
      
      const { 
        title, 
        description, 
        content, 
        bibleReference,
        keyPoints,
        objectives,
        duration,
        status,
        publishDate,
        fileUrl 
      } = req.body;
      
      await lessonPlan.update({
        title: title || lessonPlan.title,
        description: description || lessonPlan.description,
        content: content || lessonPlan.content,
        bibleReference: bibleReference || lessonPlan.bibleReference,
        keyPoints: keyPoints || lessonPlan.keyPoints,
        objectives: objectives || lessonPlan.objectives,
        duration: duration || lessonPlan.duration,
        status: status || lessonPlan.status,
        publishDate: publishDate || lessonPlan.publishDate,
        fileUrl: fileUrl || lessonPlan.fileUrl,
      });
      
      return res.status(200).json(lessonPlan);
    }
    
    // DELETE - Delete a lesson plan
    if (req.method === 'DELETE') {
      const lessonPlan = await LessonPlan.findByPk(id);
      
      if (!lessonPlan) {
        return res.status(404).json({ message: 'Lesson plan not found' });
      }
      
      // Check if the user is the creator of the lesson plan or an admin
      if (lessonPlan.createdBy !== req.session.user.id && req.session.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: 'Not authorized to delete this lesson plan' });
      }
      
      await lessonPlan.destroy();
      
      return res.status(200).json({ message: 'Lesson plan deleted successfully' });
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

// Only teachers and admins can modify lesson plans
export default withAuth(handler, [UserRole.TEACHER, UserRole.ADMIN]);
