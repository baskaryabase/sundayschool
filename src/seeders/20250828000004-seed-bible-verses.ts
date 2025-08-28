import { QueryInterface } from 'sequelize';

// Seeder name: seed-bible-verses
const seeder = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('BibleVerses', [
      {
        verseText: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
        reference: 'John 3:16',
        language: 'English',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        verseText: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
        reference: 'Proverbs 3:5-6',
        language: 'English',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        verseText: 'I can do all this through him who gives me strength.',
        reference: 'Philippians 4:13',
        language: 'English',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        verseText: 'The LORD is my shepherd, I lack nothing.',
        reference: 'Psalm 23:1',
        language: 'English',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        verseText: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud.',
        reference: '1 Corinthians 13:4',
        language: 'English',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('BibleVerses', {});
  },
};


export default seeder;
