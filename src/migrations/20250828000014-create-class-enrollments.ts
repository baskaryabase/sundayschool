const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('ClassEnrollments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      classId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Classes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      enrollmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
      },
      attendanceCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });

    // Add unique constraint to prevent duplicate enrollments
    await queryInterface.addConstraint('ClassEnrollments', {
      fields: ['studentId', 'classId'],
      type: 'unique',
      name: 'unique_student_class_enrollment'
    });

    // Add indexes for faster lookup
    await queryInterface.addIndex('ClassEnrollments', ['studentId']);
    await queryInterface.addIndex('ClassEnrollments', ['classId']);
    await queryInterface.addIndex('ClassEnrollments', ['status']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ClassEnrollments');
  }
};
