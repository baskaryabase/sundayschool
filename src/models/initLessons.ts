import { sequelize } from '../lib/db';
import Lesson from './Lesson';
import User from './User';
import Class from './Class';

export const initLessonsTable = async () => {
  try {
    // Make sure the Lesson model is defined and synced
    await Lesson.sync({ alter: true });
    console.log('Lessons table created or altered successfully');
    
    // Set up associations
    Lesson.belongsTo(Class, {
      foreignKey: 'classId',
      as: 'class'
    });

    Lesson.belongsTo(User, {
      foreignKey: 'teacherId',
      as: 'teacher'
    });
    
    console.log('Lesson associations set up successfully');
    
    return true;
  } catch (error) {
    console.error('Error initializing Lessons table:', error);
    return false;
  }
};
