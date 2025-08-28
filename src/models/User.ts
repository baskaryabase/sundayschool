import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import bcrypt from 'bcrypt';
import { UserRole } from '../types/UserRole';

// User attributes interface
export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

// User creation attributes interface (optional id, timestamps)
export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public passwordHash!: string;
  public role!: UserRole;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Helper method to check password
  public async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  // Helper method to set password
  public async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(password, salt);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...Object.values(UserRole)),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed('passwordHash')) {
          const salt = await bcrypt.genSalt(10);
          user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
        }
      },
    },
  }
);

export default User;
