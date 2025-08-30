import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import User from './User';
import Class from './Class';

// ClassEnrollment attributes interface
export interface ClassEnrollmentAttributes {
  id: number;
  studentId: number;
  classId: number;
  enrollmentDate: Date;
  status: string; // 'active', 'dropped', 'completed'
  attendanceCount?: number;
  grade?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// ClassEnrollment creation attributes interface
export interface ClassEnrollmentCreationAttributes 
  extends Optional<ClassEnrollmentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'attendanceCount' | 'grade'> {}

// ClassEnrollment model class
class ClassEnrollment extends Model<ClassEnrollmentAttributes, ClassEnrollmentCreationAttributes> 
  implements ClassEnrollmentAttributes {
  public id!: number;
  public studentId!: number;
  public classId!: number;
  public enrollmentDate!: Date;
  public status!: string;
  public attendanceCount?: number;
  public grade?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClassEnrollment.init(
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
        model: 'Users',
        key: 'id',
      },
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Classes',
        key: 'id',
      },
    },
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'dropped', 'completed']],
      },
    },
    attendanceCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'ClassEnrollment',
    tableName: 'ClassEnrollments',
    indexes: [
      {
        unique: true,
        fields: ['studentId', 'classId'],
      },
    ],
  }
);

// Set up associations
User.belongsToMany(Class, { 
  through: ClassEnrollment, 
  foreignKey: 'studentId',
  as: 'enrolledClasses'
});

Class.belongsToMany(User, { 
  through: ClassEnrollment, 
  foreignKey: 'classId',
  as: 'students'
});

// Hooks to update class enrollment counts
ClassEnrollment.addHook('afterCreate', async (enrollment) => {
  const classRecord = await Class.findByPk(enrollment.classId);
  if (classRecord && enrollment.status === 'active') {
    await classRecord.update({
      currentEnrollment: classRecord.currentEnrollment + 1
    });
  }
});

ClassEnrollment.addHook('afterUpdate', async (enrollment) => {
  const classRecord = await Class.findByPk(enrollment.classId);
  if (classRecord) {
    // If status changed from active to dropped/completed
    if (enrollment.changed('status') && 
        enrollment.previous('status') === 'active' && 
        enrollment.status !== 'active') {
      await classRecord.update({
        currentEnrollment: Math.max(0, classRecord.currentEnrollment - 1)
      });
    }
    // If status changed from dropped/completed to active
    else if (enrollment.changed('status') && 
             enrollment.previous('status') !== 'active' && 
             enrollment.status === 'active') {
      await classRecord.update({
        currentEnrollment: classRecord.currentEnrollment + 1
      });
    }
  }
});

export default ClassEnrollment;
