import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';

// Class attributes interface
export interface ClassAttributes {
  id: number;
  name: string;
  gradeLevel: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Class creation attributes interface (optional id, timestamps)
export interface ClassCreationAttributes extends Optional<ClassAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Class model class
class Class extends Model<ClassAttributes, ClassCreationAttributes> implements ClassAttributes {
  public id!: number;
  public name!: string;
  public gradeLevel!: string;

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
