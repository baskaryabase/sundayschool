import { DataTypes, QueryInterface } from 'sequelize';

// Migration name: create-quiz-questions-table
const migration = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('QuizQuestions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Quizzes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      questionText: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      options: {
        type: DataTypes.TEXT, // JSON string
        allowNull: false,
      },
      correctAnswer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });

    // Add indexes
    await queryInterface.addIndex('QuizQuestions', ['quizId']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('QuizQuestions');
  },
};

export default migration;
