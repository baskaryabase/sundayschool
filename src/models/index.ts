import User, { UserRole } from './User';
import Class from './Class';
import ClassAssignment from './ClassAssignment';
import LessonPlan from './LessonPlan';
import Attendance, { AttendanceStatus } from './Attendance';
import Assignment from './Assignment';
import Quiz from './Quiz';
import QuizQuestion from './QuizQuestion';
import QuizSubmission from './QuizSubmission';
import BibleVerse from './BibleVerse';

// Establish associations that aren't already set up in individual model files
// This ensures all associations are properly loaded when models are imported

export {
  User,
  UserRole,
  Class,
  ClassAssignment,
  LessonPlan,
  Attendance,
  AttendanceStatus,
  Assignment,
  Quiz,
  QuizQuestion,
  QuizSubmission,
  BibleVerse
};
