import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import Class from './Class';
import User from './User';

// Quiz attributes interface
export interface QuizAttributes {
  id: number;
  title: string;
  classId: number;
  createdBy: number;  // Teacher ID
  createdAt?: Date;
  updatedAt?: Date;
}

// Quiz creation attributes interface
export interface QuizCreationAttributes extends Optional<QuizAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Quiz model class
class Quiz extends Model<QuizAttributes, QuizCreationAttributes> implements QuizAttributes {
  public id!: number;
  public title!: string;
  public classId!: number;
  public createdBy!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Quiz.init(
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
    modelName: 'Quiz',
    tableName: 'Quizzes',
  }
);

// Define associations
Quiz.belongsTo(Class, { foreignKey: 'classId' });
Quiz.belongsTo(User, { foreignKey: 'createdBy', as: 'teacher' });

Class.hasMany(Quiz, { foreignKey: 'classId' });
User.hasMany(Quiz, { foreignKey: 'createdBy' });

export default Quiz;
