import { DataTypes, QueryInterface } from 'sequelize';

// Migration name: create-lesson-plans-table
const migration = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('LessonPlans', {
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
      fileUrl: {
        type: DataTypes.STRING,
        allowNull: true,
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
    await queryInterface.addIndex('LessonPlans', ['classId']);
    await queryInterface.addIndex('LessonPlans', ['createdBy']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('LessonPlans');
  },
};

export default migration;
