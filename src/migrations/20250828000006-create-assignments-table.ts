import { DataTypes, QueryInterface } from 'sequelize';

// Migration name: create-assignments-table
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Assignments', {
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
      description: {
        type: DataTypes.TEXT,
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
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
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
    await queryInterface.addIndex('Assignments', ['classId']);
    await queryInterface.addIndex('Assignments', ['dueDate']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Assignments');
  },
};
