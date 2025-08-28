import { QueryInterface } from 'sequelize';

// Seeder name: seed-quiz-questions
const seeder = {
  async up(queryInterface: QueryInterface) {
    // Get the quizzes
    const [quizzes] = await queryInterface.sequelize.query(
      'SELECT id, title FROM "Quizzes"'
    ) as [Array<{ id: number, title: string }>, unknown];

    const creationQuiz = quizzes.find(quiz => quiz.title.includes('Creation'));
    const noahQuiz = quizzes.find(quiz => quiz.title.includes('Noah'));
    const commandmentsQuiz = quizzes.find(quiz => quiz.title.includes('Commandments'));
    
    // Add questions for Creation Story quiz
    if (creationQuiz) {
      await queryInterface.bulkInsert('QuizQuestions', [
        {
          quizId: creationQuiz.id,
          questionText: 'On which day did God create light?',
          options: JSON.stringify(['First day', 'Second day', 'Third day', 'Fourth day']),
          correctAnswer: 'First day',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          quizId: creationQuiz.id,
          questionText: 'What did God create on the sixth day?',
          options: JSON.stringify(['Plants', 'Sun, moon, and stars', 'Birds and fish', 'Land animals and humans']),
          correctAnswer: 'Land animals and humans',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          quizId: creationQuiz.id,
          questionText: 'What did God do on the seventh day?',
          options: JSON.stringify(['Created the oceans', 'Created humans', 'Rested', 'Created light']),
          correctAnswer: 'Rested',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
    
    // Add questions for Noah's Ark quiz
    if (noahQuiz) {
      await queryInterface.bulkInsert('QuizQuestions', [
        {
          quizId: noahQuiz.id,
          questionText: 'How many of each clean animal did Noah take on the ark?',
          options: JSON.stringify(['One pair', 'Two pairs', 'Seven pairs', 'Ten pairs']),
          correctAnswer: 'Seven pairs',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          quizId: noahQuiz.id,
          questionText: 'How many days did it rain during the flood?',
          options: JSON.stringify(['7 days', '40 days', '100 days', '365 days']),
          correctAnswer: '40 days',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          quizId: noahQuiz.id,
          questionText: 'What bird did Noah first send out from the ark?',
          options: JSON.stringify(['Dove', 'Raven', 'Sparrow', 'Eagle']),
          correctAnswer: 'Raven',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
    
    // Add questions for Ten Commandments quiz
    if (commandmentsQuiz) {
      await queryInterface.bulkInsert('QuizQuestions', [
        {
          quizId: commandmentsQuiz.id,
          questionText: 'On which mountain did Moses receive the Ten Commandments?',
          options: JSON.stringify(['Mount Sinai', 'Mount Nebo', 'Mount Carmel', 'Mount Zion']),
          correctAnswer: 'Mount Sinai',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          quizId: commandmentsQuiz.id,
          questionText: 'What is the first commandment?',
          options: JSON.stringify([
            'You shall have no other gods before me',
            'You shall not make for yourself an image',
            'Remember the Sabbath day',
            'Honor your father and mother'
          ]),
          correctAnswer: 'You shall have no other gods before me',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          quizId: commandmentsQuiz.id,
          questionText: 'How many commandments are there?',
          options: JSON.stringify(['7', '8', '10', '12']),
          correctAnswer: '10',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('QuizQuestions', {});
  },
};

export default seeder;
