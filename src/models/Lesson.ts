import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import Class from './Class';
import User from './User';

// Lesson attributes interface
export interface LessonAttributes {
  id: number;
  title: string;
  description: string;
  scripture: string;
  objectives: string;
  materials: string;
  content: string;
  activities: string;
  classId: number;
  teacherId: number;
  scheduledDate: Date;
  duration: number; // in minutes
  status: 'draft' | 'published' | 'archived';
  createdAt?: Date;
  updatedAt?: Date;
}

// Lesson creation attributes interface (optional id, timestamps)
export interface LessonCreationAttributes extends Optional<LessonAttributes, 
  'id' | 'createdAt' | 'updatedAt' | 'activities' | 'materials' | 'status'> {
  // Required fields to create a lesson
  title: string;
  description: string;
  scripture: string;
  objectives: string;
  content: string;
  classId: number;
  teacherId: number;
  scheduledDate: Date;
  duration: number;
}

// Lesson model class
class Lesson extends Model<LessonAttributes, LessonCreationAttributes> implements LessonAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public scripture!: string;
  public objectives!: string;
  public materials!: string;
  public content!: string;
  public activities!: string;
  public classId!: number;
  public teacherId!: number;
  public scheduledDate!: Date;
  public duration!: number;
  public status!: 'draft' | 'published' | 'archived';

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  // Association declarations
  public readonly class?: Class;
  public readonly teacher?: User;
}

Lesson.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    scripture: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    objectives: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    materials: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    activities: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Classes',
        key: 'id',
      },
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60, // Default 60 minutes
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'Lessons',
    sequelize,
  }
);

// Set up associations
Lesson.belongsTo(Class, {
  foreignKey: 'classId',
  as: 'class'
});

Lesson.belongsTo(User, {
  foreignKey: 'teacherId',
  as: 'teacher'
});

export default Lesson;
