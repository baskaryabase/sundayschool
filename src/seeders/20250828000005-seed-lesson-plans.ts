import { QueryInterface } from 'sequelize';

// Seeder name: seed-lesson-plans
const seeder = {
  async up(queryInterface: QueryInterface) {
    // First, get the IDs of the classes and teacher we seeded
    const [classes] = await queryInterface.sequelize.query(
      'SELECT id, name FROM "Classes" WHERE name IN (\'Beginners Class\', \'Intermediate Class\', \'Youth Class\')'
    ) as [Array<{ id: number, name: string }>, unknown];

    const [teachers] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE email = \'teacher1@sundayschool.com\''
    ) as [Array<{ id: number }>, unknown];

    const beginnerClass = classes.find(cls => cls.name === 'Beginners Class');
    const intermediateClass = classes.find(cls => cls.name === 'Intermediate Class');
    const youthClass = classes.find(cls => cls.name === 'Youth Class');
    const teacherId = teachers.length > 0 ? teachers[0].id : 1;

    if (beginnerClass && intermediateClass && youthClass) {
      await queryInterface.bulkInsert('LessonPlans', [
        {
          title: 'Creation Story',
          description: 'Teaching about how God created the world in 7 days',
          fileUrl: 'https://example.com/lessons/creation.pdf',
          classId: beginnerClass.id,
          createdBy: teacherId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Noah\'s Ark',
          description: 'The story of Noah and the Great Flood',
          fileUrl: 'https://example.com/lessons/noah.pdf',
          classId: beginnerClass.id,
          createdBy: teacherId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'The Ten Commandments',
          description: 'Learning about the laws God gave to Moses',
          fileUrl: 'https://example.com/lessons/commandments.pdf',
          classId: intermediateClass.id,
          createdBy: teacherId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'David and Goliath',
          description: 'The story of courage and faith',
          fileUrl: 'https://example.com/lessons/david.pdf',
          classId: intermediateClass.id,
          createdBy: teacherId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'The Beatitudes',
          description: 'Jesus\'s teachings on true happiness',
          fileUrl: 'https://example.com/lessons/beatitudes.pdf',
          classId: youthClass.id,
          createdBy: teacherId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Parables of Jesus',
          description: 'Understanding Jesus\'s teachings through stories',
          fileUrl: 'https://example.com/lessons/parables.pdf',
          classId: youthClass.id,
          createdBy: teacherId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('LessonPlans', {});
  },
};

export default seeder;
