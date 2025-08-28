import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import User from './User';
import Class from './Class';

// Attendance status enum
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
}

// Attendance attributes interface
export interface AttendanceAttributes {
  id: number;
  studentId: number;
  classId: number;
  date: Date;
  status: AttendanceStatus;
  markedBy: number;  // Teacher ID
  createdAt?: Date;
  updatedAt?: Date;
}

// Attendance creation attributes interface
export interface AttendanceCreationAttributes extends Optional<AttendanceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Attendance model class
class Attendance extends Model<AttendanceAttributes, AttendanceCreationAttributes> implements AttendanceAttributes {
  public id!: number;
  public studentId!: number;
  public classId!: number;
  public date!: Date;
  public status!: AttendanceStatus;
  public markedBy!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Attendance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Class,
        key: 'id',
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(AttendanceStatus)),
      allowNull: false,
    },
    markedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Attendance',
    tableName: 'Attendances',
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'classId', 'date'],
      },
    ],
  }
);

// Define associations
Attendance.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Attendance.belongsTo(User, { foreignKey: 'markedBy', as: 'teacher' });
Attendance.belongsTo(Class, { foreignKey: 'classId' });

User.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendanceRecords' });
User.hasMany(Attendance, { foreignKey: 'markedBy', as: 'markedAttendance' });
Class.hasMany(Attendance, { foreignKey: 'classId' });

export default Attendance;
