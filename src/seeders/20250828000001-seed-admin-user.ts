import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';

// Seeder name: seed-admin-user
const seeder = {
  async up(queryInterface: QueryInterface) {
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@sundayschool.com',
        passwordHash,
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Teacher One',
        email: 'teacher1@sundayschool.com',
        passwordHash: await bcrypt.hash('Teacher123!', 10),
        role: 'TEACHER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Student One',
        email: 'student1@sundayschool.com',
        passwordHash: await bcrypt.hash('Student123!', 10),
        role: 'STUDENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Parent One',
        email: 'parent1@sundayschool.com',
        passwordHash: await bcrypt.hash('Parent123!', 10),
        role: 'PARENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('Users', {});
  },
};


export default seeder;
