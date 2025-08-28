import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import Quiz from './Quiz';
import User from './User';

// QuizSubmission attributes interface
export interface QuizSubmissionAttributes {
  id: number;
  quizId: number;
  studentId: number;
  answers: string; // JSON string of answers
  score: number;
  submittedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// QuizSubmission creation attributes interface
export interface QuizSubmissionCreationAttributes extends Optional<QuizSubmissionAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// QuizSubmission model class
class QuizSubmission extends Model<QuizSubmissionAttributes, QuizSubmissionCreationAttributes> implements QuizSubmissionAttributes {
  public id!: number;
  public quizId!: number;
  public studentId!: number;
  public answers!: string;
  public score!: number;
  public submittedAt!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper method to get answers as object
  public getAnswers(): Record<string, string> {
    return JSON.parse(this.answers);
  }
}

QuizSubmission.init(
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
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    answers: {
      type: DataTypes.TEXT, // Stores JSON string of answers (questionId -> answer)
      allowNull: false,
      get() {
        const rawValue = this.getDataValue('answers');
        return rawValue ? JSON.parse(rawValue) : {};
      },
      set(value: Record<string, string> | string) {
        this.setDataValue('answers', typeof value === 'string' ? value : JSON.stringify(value));
      },
    },
    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    submittedAt: {
      type: DataTypes.DATE,
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
    modelName: 'QuizSubmission',
    tableName: 'QuizSubmissions',
    indexes: [
      {
        unique: true,
        fields: ['quizId', 'studentId'],
      },
    ],
  }
);

// Define associations
QuizSubmission.belongsTo(Quiz, { foreignKey: 'quizId' });
QuizSubmission.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

Quiz.hasMany(QuizSubmission, { foreignKey: 'quizId' });
User.hasMany(QuizSubmission, { foreignKey: 'studentId' });

export default QuizSubmission;
