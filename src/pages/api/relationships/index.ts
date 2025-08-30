import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '../../../lib/api-auth';
import ParentChild from '../../../models/ParentChild';
import User from '../../../models/User';
import { UserRole } from '../../../types/UserRole';

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = req.query;

    // If userId is provided, we'll get parent-child relationships for a specific user
    if (userId && typeof userId === 'string') {
      const user = await User.findByPk(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check authorization - a user can see their own relationships, 
      // or an admin/teacher can see any relationships
      if (
        req.session.user.id !== parseInt(userId) && 
        ![UserRole.ADMIN, UserRole.TEACHER].includes(req.session.user.role as UserRole)
      ) {
        return res.status(403).json({ message: 'Not authorized to access these relationships' });
      }
      
      if (req.method === 'GET') {
        let relationships;
        
        // If the user is a parent, get their children
        if (user.role === UserRole.PARENT) {
          relationships = await ParentChild.findAll({
            where: { parentId: userId },
            include: [
              {
                model: User,
                as: 'child',
                attributes: ['id', 'name', 'email', 'role'],
              },
            ],
          });
          
          return res.status(200).json({
            parentId: parseInt(userId),
            parentName: user.name,
            children: relationships.map(r => r.child),
          });
        } 
        // If the user is a student, get their parents
        else if (user.role === UserRole.STUDENT) {
          relationships = await ParentChild.findAll({
            where: { childId: userId },
            include: [
              {
                model: User,
                as: 'parent',
                attributes: ['id', 'name', 'email', 'role'],
              },
            ],
          });
          
          return res.status(200).json({
            childId: parseInt(userId),
            childName: user.name,
            parents: relationships.map(r => r.parent),
          });
        } else {
          return res.status(400).json({ message: 'User must be a parent or student to have relationships' });
        }
      }
      
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
    // Handling actions on all parent-child relationships
    if (req.method === 'GET') {
      // Only admins can list all relationships
      if (req.session.user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: 'Not authorized to view all relationships' });
      }
      
      const relationships = await ParentChild.findAll({
        include: [
          {
            model: User,
            as: 'parent',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: User,
            as: 'child',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });
      
      return res.status(200).json(relationships);
    }
    
    if (req.method === 'POST') {
      const { parentId, childId, relationship, isPrimary } = req.body;
      
      // Validate required fields
      if (!parentId || !childId || !relationship) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Check if both users exist and have the correct roles
      const parent = await User.findByPk(parentId);
      const child = await User.findByPk(childId);
      
      if (!parent || parent.role !== UserRole.PARENT) {
        return res.status(400).json({ message: 'Invalid parent ID or user is not a parent' });
      }
      
      if (!child || child.role !== UserRole.STUDENT) {
        return res.status(400).json({ message: 'Invalid child ID or user is not a student' });
      }
      
      // Check if the relationship already exists
      const existingRelationship = await ParentChild.findOne({
        where: { parentId, childId },
      });
      
      if (existingRelationship) {
        return res.status(409).json({ message: 'Relationship already exists' });
      }
      
      // If this is to be the primary relationship, unset any existing primary relationship
      if (isPrimary) {
        await ParentChild.update(
          { isPrimary: false },
          { where: { childId, isPrimary: true } }
        );
      }
      
      // Create the relationship
      const newRelationship = await ParentChild.create({
        parentId,
        childId,
        relationship,
        isPrimary: !!isPrimary,
      });
      
      return res.status(201).json(newRelationship);
    }
    
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
}

// Admin or the specific user themselves can access their relationships
export default withAuth(handler);
