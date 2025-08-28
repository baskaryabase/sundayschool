import { QueryInterface } from 'sequelize';

// Seeder name: seed-class-assignments
module.exports = {
  async up(queryInterface: QueryInterface) {
    // First, get the IDs of the users and classes we seeded
    const [users] = await queryInterface.sequelize.query(
      'SELECT id, role FROM "Users" WHERE email IN (\'teacher1@sundayschool.com\', \'student1@sundayschool.com\')'
    ) as [Array<{ id: number, role: string }>, unknown];
    const [classes] = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Classes" WHERE name IN (\'Beginners Class\', \'Intermediate Class\', \'Youth Class\')'
    ) as [Array<{ id: number, name: string }>, unknown];

    const teacher = users.find(user => user.role === 'TEACHER');
    const student = users.find(user => user.role === 'STUDENT');
    const beginnerClass = classes.find(cls => cls.name === 'Beginners Class');

    if (teacher && student && beginnerClass) {
      await queryInterface.bulkInsert('ClassAssignments', [
        {
          userId: teacher.id,
          classId: beginnerClass.id,
          role: 'TEACHER',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: student.id,
          classId: beginnerClass.id,
          role: 'STUDENT',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('ClassAssignments', {});
  },
};
