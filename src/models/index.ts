import User from './User';
import { UserRole } from '../types/UserRole';
import Class from './Class';
import ClassAssignment from './ClassAssignment';
import LessonPlan from './LessonPlan';
import LessonMaterial from './LessonMaterial';
import Attendance, { AttendanceStatus } from './Attendance';
import Assignment from './Assignment';
import Quiz from './Quiz';
import QuizQuestion from './QuizQuestion';
import QuizSubmission from './QuizSubmission';
import BibleVerse from './BibleVerse';
import ParentChild from './ParentChild';
import ClassEnrollment from './ClassEnrollment';
import Lesson from './Lesson';

// Establish associations that aren't already set up in individual model files
// This ensures all associations are properly loaded when models are imported

// Setup Class and Lesson associations
Class.hasMany(Lesson, { 
  foreignKey: 'classId',
  as: 'lessons' 
});

// Setup User and Lesson associations
User.hasMany(Lesson, {
  foreignKey: 'teacherId',
  as: 'lessons'
});

export {
  User,
  UserRole,
  Class,
  ClassAssignment,
  LessonPlan,
  LessonMaterial,
  Attendance,
  AttendanceStatus,
  Assignment,
  Quiz,
  QuizQuestion,
  QuizSubmission,
  BibleVerse,
  ParentChild,
  ClassEnrollment,
  Lesson
};
