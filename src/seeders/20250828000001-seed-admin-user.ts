import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';
import { UserRole } from '../models/User';

// Seeder name: seed-admin-user
module.exports = {
  async up(queryInterface: QueryInterface) {
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@sundayschool.com',
        passwordHash,
        role: UserRole.ADMIN,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Teacher One',
        email: 'teacher1@sundayschool.com',
        passwordHash: await bcrypt.hash('Teacher123!', 10),
        role: UserRole.TEACHER,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Student One',
        email: 'student1@sundayschool.com',
        passwordHash: await bcrypt.hash('Student123!', 10),
        role: UserRole.STUDENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Parent One',
        email: 'parent1@sundayschool.com',
        passwordHash: await bcrypt.hash('Parent123!', 10),
        role: UserRole.PARENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete('Users', {});
  },
};
