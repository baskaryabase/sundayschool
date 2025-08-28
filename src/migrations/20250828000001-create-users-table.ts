import { DataTypes, QueryInterface } from 'sequelize';
import { UserRole } from '../models/User';

// Migration name: create-users-table
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(UserRole)),
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
    await queryInterface.addIndex('Users', ['email']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Users');
  },
};
