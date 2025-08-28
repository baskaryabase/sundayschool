import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import Quiz from './Quiz';

// QuizQuestion attributes interface
export interface QuizQuestionAttributes {
  id: number;
  quizId: number;
  questionText: string;
  options: string; // JSON string of options
  correctAnswer: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// QuizQuestion creation attributes interface
export interface QuizQuestionCreationAttributes extends Optional<QuizQuestionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// QuizQuestion model class
class QuizQuestion extends Model<QuizQuestionAttributes, QuizQuestionCreationAttributes> implements QuizQuestionAttributes {
  public id!: number;
  public quizId!: number;
  public questionText!: string;
  public options!: string;
  public correctAnswer!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper method to get options as array
  public getOptions(): string[] {
    return JSON.parse(this.options);
  }
}

QuizQuestion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Quiz,
        key: 'id',
      },
    },
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.TEXT, // Stores JSON string of options
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('options');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value: string[] | string) {
        this.setDataValue('options', typeof value === 'string' ? value : JSON.stringify(value));
      },
    },
    correctAnswer: {
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
    modelName: 'QuizQuestion',
    tableName: 'QuizQuestions',
  }
);

// Define associations
QuizQuestion.belongsTo(Quiz, { foreignKey: 'quizId' });
Quiz.hasMany(QuizQuestion, { foreignKey: 'quizId' });

export default QuizQuestion;
