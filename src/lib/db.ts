import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import config from '../../config/config.js';

dotenv.config();

interface DbConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: string;
  logging: boolean;
  dialectOptions?: {
    ssl?: {
      require: boolean;
      rejectUnauthorized: boolean;
    };
  };
}

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env as keyof typeof config] as DbConfig;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: 'postgres',
    logging: dbConfig.logging,
    ...(dbConfig.dialectOptions ? { dialectOptions: dbConfig.dialectOptions } : {}),
  }
);

export { sequelize };

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return null;
  }
};

export default sequelize;
