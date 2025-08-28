import { QueryInterface } from 'sequelize';

// Seeder name: seed-quiz-submissions
const seeder = {
  async up(queryInterface: QueryInterface) {
    // Get student user
    const [users] = await queryInterface.sequelize.query(
      'SELECT id FROM "Users" WHERE email = \'student1@sundayschool.com\''
    ) as [Array<{ id: number }>, unknown];
    
    if (users.length === 0) return;
    
    const studentId = users[0].id;
    
    // Get quiz and questions
    const [quizzes] = await queryInterface.sequelize.query(
      'SELECT "Quizzes".id, "Quizzes".title ' +
      'FROM "Quizzes" ' +
      'JOIN "Classes" ON "Classes".id = "Quizzes"."classId" ' +
      'JOIN "ClassAssignments" ON "ClassAssignments"."classId" = "Classes".id ' +
      'WHERE "ClassAssignments"."userId" = :userId',
      { replacements: { userId: studentId } }
    ) as [Array<{ id: number, title: string }>, unknown];
    
    if (quizzes.length === 0) return;
    
    // For each quiz, get its questions
    for (const quiz of quizzes) {
      const [questions] = await queryInterface.sequelize.query(
        'SELECT id, "questionText", "correctAnswer" FROM "QuizQuestions" WHERE "quizId" = :quizId',
        { replacements: { quizId: quiz.id } }
      ) as [Array<{ id: number, questionText: string, correctAnswer: string }>, unknown];
      
      if (questions.length === 0) continue;
      
      // Create submission for the Creation Story quiz (partially correct)
      if (quiz.title.includes('Creation')) {
        // Create quiz submission
        await queryInterface.bulkInsert('QuizSubmissions', [{
          quizId: quiz.id,
          studentId: studentId,
          answers: JSON.stringify([
            { questionId: questions[0].id, answer: questions[0].correctAnswer, isCorrect: true },
            { questionId: questions[1].id, answer: questions[1].correctAnswer, isCorrect: true },
            { questionId: questions[2].id, answer: 'Plants', isCorrect: false }
          ]),
          score: 10, // 2 out of 3 correct
          submittedAt: new Date(2025, 8, 13), // September 13, 2025
          createdAt: new Date(),
          updatedAt: new Date()
        }]);
      }
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('QuizSubmissions', {});
  },
};

export default seeder;
