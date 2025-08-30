import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';
import User from './User';

// ParentChild attributes interface
export interface ParentChildAttributes {
  id: number;
  parentId: number;
  childId: number;
  relationship: string; // e.g. 'Father', 'Mother', 'Guardian'
  isPrimary: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// ParentChild creation attributes interface
export interface ParentChildCreationAttributes extends Optional<ParentChildAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// ParentChild model class
class ParentChild extends Model<ParentChildAttributes, ParentChildCreationAttributes> implements ParentChildAttributes {
  public id!: number;
  public parentId!: number;
  public childId!: number;
  public relationship!: string;
  public isPrimary!: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ParentChild.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    childId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    relationship: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    modelName: 'ParentChild',
    tableName: 'ParentChildRelationships',
    indexes: [
      {
        unique: true,
        fields: ['parentId', 'childId'],
      },
    ],
  }
);

// Set up associations
User.belongsToMany(User, { 
  through: ParentChild, 
  foreignKey: 'parentId',
  otherKey: 'childId',
  as: 'children'
});

User.belongsToMany(User, { 
  through: ParentChild, 
  foreignKey: 'childId',
  otherKey: 'parentId',
  as: 'parents'
});

// Direct associations for easier querying
ParentChild.belongsTo(User, {
  foreignKey: 'parentId',
  as: 'parent'
});

ParentChild.belongsTo(User, {
  foreignKey: 'childId',
  as: 'child'
});

export default ParentChild;
