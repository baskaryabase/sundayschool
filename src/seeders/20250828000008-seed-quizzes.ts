import { QueryInterface } from 'sequelize';

// Seeder name: seed-quizzes
const seeder = {
  async up(queryInterface: QueryInterface) {
    // Get lesson plans and teacher
    const [lessonPlans] = await queryInterface.sequelize.query(
      'SELECT id, title, "classId" FROM "LessonPlans"'
    ) as [Array<{ id: number, title: string, classId: number }>, unknown];
    
    const [teachers] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE email = \'teacher1@sundayschool.com\''
    ) as [Array<{ id: number }>, unknown];
    
    const teacherId = teachers.length > 0 ? teachers[0].id : 1;

    if (lessonPlans.length > 0) {
      const creationLessonPlan = lessonPlans.find(plan => plan.title.includes('Creation'));
      const noahLessonPlan = lessonPlans.find(plan => plan.title.includes('Noah'));
      const commandmentsLessonPlan = lessonPlans.find(plan => plan.title.includes('Commandments'));
      
      const quizzes = [];

      if (creationLessonPlan) {
        quizzes.push({
          title: 'Creation Story Quiz',
          classId: creationLessonPlan.classId,
          createdBy: teacherId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      if (noahLessonPlan) {
        quizzes.push({
          title: 'Noah\'s Ark Quiz',
          classId: noahLessonPlan.classId,
          createdBy: teacherId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      if (commandmentsLessonPlan) {
        quizzes.push({
          title: 'Ten Commandments Quiz',
          classId: commandmentsLessonPlan.classId,
          createdBy: teacherId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      if (quizzes.length > 0) {
        await queryInterface.bulkInsert('Quizzes', quizzes);
      }
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('Quizzes', {});
  },
};

export default seeder;
