import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';

// Class attributes interface
export interface ClassAttributes {
  id: number;
  name: string;
  gradeLevel: string;
  description?: string;
  academicYear: string;
  semester?: string;
  maxCapacity: number;
  currentEnrollment: number;
  scheduleDay: string;
  scheduleTime: string;
  location?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Class creation attributes interface (optional id, timestamps)
export interface ClassCreationAttributes extends Optional<ClassAttributes, 
  'id' | 'createdAt' | 'updatedAt' | 'description' | 'semester' | 
  'currentEnrollment' | 'location' | 'isActive'> {}

// Class model class
class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  public id!: number;
  public name!: string;
  public gradeLevel!: string;
  public description?: string;
  public academicYear!: string;
  public semester?: string;
  public maxCapacity!: number;
  public currentEnrollment!: number;
  public scheduleDay!: string;
  public scheduleTime!: string;
  public location?: string;
  public isActive!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Class.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gradeLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    academicYear: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: new Date().getFullYear().toString(),
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    maxCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 25,
    },
    currentEnrollment: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    scheduleDay: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Sunday',
    },
    scheduleTime: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '10:00 AM',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    modelName: 'Class',
    tableName: 'Classes',
  }
);

export default Class;
