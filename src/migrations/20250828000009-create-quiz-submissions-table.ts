import { DataTypes, QueryInterface } from 'sequelize';

// Migration name: create-quiz-submissions-table
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('QuizSubmissions', {
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
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      answers: {
        type: DataTypes.TEXT, // JSON string
        allowNull: false,
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
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });

    // Add unique constraint and indexes
    await queryInterface.addIndex('QuizSubmissions', ['quizId', 'studentId'], {
      unique: true,
    });
    await queryInterface.addIndex('QuizSubmissions', ['studentId']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('QuizSubmissions');
  },
};
