import { DataTypes, QueryInterface } from 'sequelize';
// Attendance status as string literals
const ATTENDANCE_STATUS = ['PRESENT', 'ABSENT', 'EXCUSED', 'LATE'];

// Migration name: create-attendance-table
const migration = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Attendances', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('PRESENT', 'ABSENT', 'EXCUSED', 'LATE'),
        allowNull: false,
      },
      markedBy: {
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

    // Add unique constraint and indexes
    await queryInterface.addIndex('Attendances', ['studentId', 'classId', 'date'], {
      unique: true,
    });
    await queryInterface.addIndex('Attendances', ['classId', 'date']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Attendances');
  },
};

export default migration;
