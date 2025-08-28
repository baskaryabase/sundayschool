import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import User from './User';
import Class from './Class';

// ClassAssignment attributes interface
export interface ClassAssignmentAttributes {
  id: number;
  userId: number;
  classId: number;
  role: 'STUDENT' | 'TEACHER';  // Role in the class, not the overall user role
  createdAt?: Date;
  updatedAt?: Date;
}

// ClassAssignment creation attributes interface
export interface ClassAssignmentCreationAttributes extends Optional<ClassAssignmentAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// ClassAssignment model class
class ClassAssignment extends Model<ClassAssignmentAttributes, ClassAssignmentCreationAttributes> implements ClassAssignmentAttributes {
  public id!: number;
  public userId!: number;
  public classId!: number;
  public role!: 'STUDENT' | 'TEACHER';

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClassAssignment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Class,
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM('STUDENT', 'TEACHER'),
      allowNull: false,
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
    modelName: 'ClassAssignment',
    tableName: 'ClassAssignments',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'classId'],
      },
    ],
  }
);

// Define associations
User.belongsToMany(Class, {
  through: ClassAssignment,
  foreignKey: 'userId',
  otherKey: 'classId',
});

Class.belongsToMany(User, {
  through: ClassAssignment,
  foreignKey: 'classId',
  otherKey: 'userId',
});

export default ClassAssignment;
