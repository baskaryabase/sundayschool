import { QueryInterface } from 'sequelize';

// Seeder name: seed-assignments
const seeder = {
  async up(queryInterface: QueryInterface) {
    // Get the class assignment for the student
    const [classAssignments] = await queryInterface.sequelize.query(
      'SELECT "ClassAssignments".id, "ClassAssignments"."userId", "ClassAssignments"."classId" ' +
      'FROM "ClassAssignments" ' +
      'JOIN "Users" ON "Users".id = "ClassAssignments"."userId" ' +
      'WHERE "Users".email = \'student1@sundayschool.com\''
    ) as [Array<{ id: number, userId: number, classId: number }>, unknown];

    // Get lesson plans for the student's class
    if (classAssignments.length > 0) {
      const studentAssignment = classAssignments[0];
      
      const [lessonPlans] = await queryInterface.sequelize.query(
        'SELECT id, title FROM "LessonPlans" WHERE "classId" = :classId',
        {
          replacements: { classId: studentAssignment.classId }
        }
      ) as [Array<{ id: number, title: string }>, unknown];

      // Get teacher ID
      const [teachers] = await queryInterface.sequelize.query(
        'SELECT id FROM "Users" WHERE email = \'teacher1@sundayschool.com\''
      ) as [Array<{ id: number }>, unknown];
      
      const teacherId = teachers.length > 0 ? teachers[0].id : 1;

      if (lessonPlans.length > 0) {
        await queryInterface.bulkInsert('Assignments', [
          {
            title: 'Memory Verse Recitation',
            description: 'Memorize John 3:16 and be prepared to recite it in class next week.',
            classId: studentAssignment.classId,
            dueDate: new Date(2025, 8, 14), // September 14, 2025
            createdBy: teacherId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            title: 'Creation Drawing',
            description: 'Draw a picture of your favorite day of creation and explain why you chose it.',
            classId: studentAssignment.classId,
            dueDate: new Date(2025, 8, 14), // September 14, 2025
            createdBy: teacherId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            title: 'Noah\'s Ark Quiz',
            description: 'Complete the worksheet with questions about Noah\'s Ark.',
            classId: studentAssignment.classId,
            dueDate: new Date(2025, 8, 21), // September 21, 2025
            createdBy: teacherId,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      }
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('Assignments', {});
  },
};

export default seeder;
