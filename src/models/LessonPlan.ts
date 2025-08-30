import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import Class from './Class';
import User from './User';

// LessonPlan attributes interface
export interface LessonPlanAttributes {
  id: number;
  title: string;
  description: string;
  content: string;  // Rich text content of the lesson
  bibleReference: string;  // Bible verses covered
  keyPoints: string[];  // Array of key learning points
  objectives: string;  // Learning objectives
  duration: number;  // Lesson duration in minutes
  fileUrl?: string;  // Optional file URL (can be PDF, video, etc.)
  status: string;  // draft, published, archived
  publishDate?: Date;
  classId: number;
  createdBy: number;  // Teacher ID
  createdAt?: Date;
  updatedAt?: Date;
}

// LessonPlan creation attributes interface
export interface LessonPlanCreationAttributes extends Optional<LessonPlanAttributes, 
  'id' | 'fileUrl' | 'createdAt' | 'updatedAt' | 'publishDate' | 'status'> {}

// LessonPlan model class
class LessonPlan extends Model<LessonPlanAttributes, LessonPlanCreationAttributes> implements LessonPlanAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public content!: string;
  public bibleReference!: string;
  public keyPoints!: string[];
  public objectives!: string;
  public duration!: number;
  public fileUrl?: string;
  public status!: string;
  public publishDate?: Date;
  public classId!: number;
  public createdBy!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LessonPlan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    bibleReference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keyPoints: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    objectives: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 45, // 45 minutes default
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'draft',
      validate: {
        isIn: [['draft', 'published', 'archived']],
      },
    },
    publishDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Class,
        key: 'id',
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'LessonPlan',
    tableName: 'LessonPlans',
  }
);

// Define associations
LessonPlan.belongsTo(Class, { foreignKey: 'classId' });
LessonPlan.belongsTo(User, { foreignKey: 'createdBy', as: 'teacher' });

Class.hasMany(LessonPlan, { foreignKey: 'classId' });
User.hasMany(LessonPlan, { foreignKey: 'createdBy' });

export default LessonPlan;
