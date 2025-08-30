import { NextApiRequest, NextApiResponse } from 'next';
import Class from '../../../../../models/Class';
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
    if (req.method === 'PATCH') {
      // Find the class by ID
      const classData = await Class.findByPk(id);
      
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
      
      // Check if isActive is provided in the request body
      const { isActive } = req.body;
      
      if (isActive === undefined) {
        return res.status(400).json({ message: 'Missing isActive field' });
      }
      
      // Update the class status
      await classData.update({ isActive });
      
      return res.status(200).json(classData);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

// Only admins can update class status
export default withAuth(handler, [UserRole.ADMIN]);
