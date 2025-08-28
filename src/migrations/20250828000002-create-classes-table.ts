import { DataTypes, QueryInterface } from 'sequelize';

// Migration name: create-classes-table
const migration = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Classes', {
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
      gradeLevel: {
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
    await queryInterface.addIndex('Classes', ['gradeLevel']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Classes');
  },
};

export default migration;
