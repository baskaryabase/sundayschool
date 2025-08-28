import { QueryInterface } from 'sequelize';

// Seeder name: seed-attendances
const seeder = {
  async up(queryInterface: QueryInterface) {
    // Get student and teacher IDs
    const [users] = await queryInterface.sequelize.query(
      'SELECT id, email FROM "Users" WHERE email IN (\'student1@sundayschool.com\', \'teacher1@sundayschool.com\')'
    ) as [Array<{ id: number, email: string }>, unknown];

    const student = users.find(u => u.email === 'student1@sundayschool.com');
    const teacher = users.find(u => u.email === 'teacher1@sundayschool.com');

    // Get class ID for the student
    const [classAssignments] = await queryInterface.sequelize.query(
      'SELECT "ClassAssignments"."classId" ' +
      'FROM "ClassAssignments" ' +
      'WHERE "ClassAssignments"."userId" = :userId',
      { replacements: { userId: student?.id } }
    ) as [Array<{ classId: number }>, unknown];

    if (student && teacher && classAssignments.length > 0) {
      const classId = classAssignments[0].classId;
      
      // Create attendance records for the past few weeks
      const today = new Date();
      const pastDates = [];
      
      // Generate dates for the past 4 Sundays
      for (let i = 1; i <= 4; i++) {
        const pastDate = new Date();
        pastDate.setDate(today.getDate() - (7 * i));
        // Adjust to Sunday
        pastDate.setDate(pastDate.getDate() - pastDate.getDay());
        pastDates.push(pastDate);
      }

      // Create attendance records
      await queryInterface.bulkInsert('Attendances', [
        {
          studentId: student.id,
          classId: classId,
          date: pastDates[0].toISOString().split('T')[0], // Convert to DATEONLY format
          status: 'PRESENT',
          markedBy: teacher.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          studentId: student.id,
          classId: classId,
          date: pastDates[1].toISOString().split('T')[0],
          status: 'ABSENT',
          markedBy: teacher.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          studentId: student.id,
          classId: classId,
          date: pastDates[2].toISOString().split('T')[0],
          status: 'PRESENT',
          markedBy: teacher.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          studentId: student.id,
          classId: classId,
          date: pastDates[3].toISOString().split('T')[0],
          status: 'LATE',
          markedBy: teacher.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('Attendances', {});
  },
};

export default seeder;
