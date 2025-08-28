import { DataTypes, QueryInterface } from 'sequelize';

// Migration name: create-quizzes-table
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Quizzes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Classes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.addIndex('Quizzes', ['classId']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Quizzes');
  },
};
