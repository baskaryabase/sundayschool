import { DataTypes, QueryInterface } from 'sequelize';

// User roles as string literals
const USER_ROLES = ['STUDENT', 'TEACHER', 'PARENT', 'ADMIN'];

// Migration name: create-users-table
const migration = {
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
        type: DataTypes.ENUM('STUDENT', 'TEACHER', 'PARENT', 'ADMIN'),
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

export default migration;
