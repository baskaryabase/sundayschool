import { QueryInterface } from 'sequelize';

export interface Migration {
  up: (queryInterface: QueryInterface, Sequelize?: any) => Promise<void>;
  down: (queryInterface: QueryInterface, Sequelize?: any) => Promise<void>;
}
