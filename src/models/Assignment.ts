import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import Class from './Class';
import User from './User';

// Assignment attributes interface
export interface AssignmentAttributes {
  id: number;
  title: string;
  description: string;
  classId: number;
  dueDate: Date;
  createdBy: number;  // Teacher ID
  createdAt?: Date;
  updatedAt?: Date;
}

// Assignment creation attributes interface
export interface AssignmentCreationAttributes extends Optional<AssignmentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Assignment model class
class Assignment extends Model<AssignmentAttributes, AssignmentCreationAttributes> implements AssignmentAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public classId!: number;
  public dueDate!: Date;
  public createdBy!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Assignment.init(
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
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Class,
        key: 'id',
      },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
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
    modelName: 'Assignment',
    tableName: 'Assignments',
  }
);

// Define associations
Assignment.belongsTo(Class, { foreignKey: 'classId' });
Assignment.belongsTo(User, { foreignKey: 'createdBy', as: 'teacher' });

Class.hasMany(Assignment, { foreignKey: 'classId' });
User.hasMany(Assignment, { foreignKey: 'createdBy' });

export default Assignment;
