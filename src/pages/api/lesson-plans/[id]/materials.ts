import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../../lib/api-auth';
import LessonMaterial from '../../../../models/LessonMaterial';
import LessonPlan from '../../../../models/LessonPlan';
import { UserRole } from '../../../../types/UserRole';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid lesson ID' });
  }

  try {
    // Check if the lesson plan exists
    const lessonPlan = await LessonPlan.findByPk(id);
    
    if (!lessonPlan) {
      return res.status(404).json({ message: 'Lesson plan not found' });
    }

    // GET - List all materials for a lesson
    if (req.method === 'GET') {
      const materials = await LessonMaterial.findAll({
        where: { lessonId: id },
        order: [['sortOrder', 'ASC']],
      });
      
      return res.status(200).json(materials);
    }
    
    // POST - Add a new material to a lesson
    if (req.method === 'POST') {
      // Check if the user is the creator of the lesson plan or an admin
      if (lessonPlan.createdBy !== req.session.user.id && req.session.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: 'Not authorized to add materials to this lesson' });
      }
      
      const { 
        title, 
        description, 
        type, 
        url,
        fileSize,
        format,
        sortOrder,
        isRequired 
      } = req.body;
      
      // Validate required fields
      if (!title || !type || !url) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Validate type
      const validTypes = ['document', 'video', 'audio', 'image', 'link'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ message: 'Invalid material type' });
      }
      
      // Get the next sort order if not provided
      let nextSortOrder = sortOrder;
      if (nextSortOrder === undefined) {
        const maxOrderMaterial = await LessonMaterial.findOne({
          where: { lessonId: id },
          order: [['sortOrder', 'DESC']],
        });
        
        nextSortOrder = maxOrderMaterial ? maxOrderMaterial.sortOrder + 1 : 0;
      }
      
      // Create the material
      const material = await LessonMaterial.create({
        lessonId: parseInt(id),
        title,
        description,
        type,
        url,
        fileSize,
        format,
        sortOrder: nextSortOrder,
        isRequired: isRequired || false,
      });
      
      return res.status(201).json(material);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

export default withAuth(handler, [UserRole.TEACHER, UserRole.ADMIN]);
