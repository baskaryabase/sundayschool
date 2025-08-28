import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import Class from './Class';
import User from './User';

// LessonPlan attributes interface
export interface LessonPlanAttributes {
  id: number;
  title: string;
  description: string;
  fileUrl?: string;  // Optional file URL (can be PDF, video, etc.)
  classId: number;
  createdBy: number;  // Teacher ID
  createdAt?: Date;
  updatedAt?: Date;
}

// LessonPlan creation attributes interface
export interface LessonPlanCreationAttributes extends Optional<LessonPlanAttributes, 'id' | 'fileUrl' | 'createdAt' | 'updatedAt'> {}

// LessonPlan model class
class LessonPlan extends Model<LessonPlanAttributes, LessonPlanCreationAttributes> implements LessonPlanAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public fileUrl?: string;
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
