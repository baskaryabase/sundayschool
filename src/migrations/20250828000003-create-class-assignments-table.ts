import { DataTypes, QueryInterface } from 'sequelize';

// Migration name: create-class-assignments-table
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('ClassAssignments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      role: {
        type: DataTypes.ENUM('STUDENT', 'TEACHER'),
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

    // Add unique constraint
    await queryInterface.addIndex('ClassAssignments', ['userId', 'classId'], {
      unique: true,
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('ClassAssignments');
  },
};
