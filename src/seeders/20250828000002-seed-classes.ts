import { QueryInterface } from 'sequelize';

// Seeder name: seed-classes
module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.bulkInsert('Classes', [
      {
        name: 'Beginners Class',
        gradeLevel: 'Grade 1-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Intermediate Class',
        gradeLevel: 'Grade 3-5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Youth Class',
        gradeLevel: 'Grade 6-8',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('Classes', {});
  },
};
