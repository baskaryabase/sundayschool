import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import LessonPlan from './LessonPlan';

// LessonMaterial attributes interface
export interface LessonMaterialAttributes {
  id: number;
  lessonId: number;
  title: string;
  description?: string;
  type: string;  // 'document', 'video', 'audio', 'image', 'link'
  url: string;
  fileSize?: number;
  format?: string;
  sortOrder: number;
  isRequired: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// LessonMaterial creation attributes interface
export interface LessonMaterialCreationAttributes extends Optional<LessonMaterialAttributes, 
  'id' | 'createdAt' | 'updatedAt' | 'description' | 'fileSize' | 'format'> {}

// LessonMaterial model class
class LessonMaterial extends Model<LessonMaterialAttributes, LessonMaterialCreationAttributes> implements LessonMaterialAttributes {
  public id!: number;
  public lessonId!: number;
  public title!: string;
  public description?: string;
  public type!: string;
  public url!: string;
  public fileSize?: number;
  public format?: string;
  public sortOrder!: number;
  public isRequired!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

LessonMaterial.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'LessonPlans',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['document', 'video', 'audio', 'image', 'link']],
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    format: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'LessonMaterial',
    tableName: 'LessonMaterials',
  }
);

// Set up associations
LessonPlan.hasMany(LessonMaterial, { foreignKey: 'lessonId' });
LessonMaterial.belongsTo(LessonPlan, { foreignKey: 'lessonId' });

export default LessonMaterial;
