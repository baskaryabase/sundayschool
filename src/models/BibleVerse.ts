import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../lib/db';

// BibleVerse attributes interface
export interface BibleVerseAttributes {
  id: number;
  verseText: string;
  reference: string;
  language: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// BibleVerse creation attributes interface
export interface BibleVerseCreationAttributes extends Optional<BibleVerseAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// BibleVerse model class
class BibleVerse extends Model<BibleVerseAttributes, BibleVerseCreationAttributes> implements BibleVerseAttributes {
  public id!: number;
  public verseText!: string;
  public reference!: string;
  public language!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BibleVerse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    verseText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'English',
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
    modelName: 'BibleVerse',
    tableName: 'BibleVerses',
    indexes: [
      {
        fields: ['reference'],
      },
    ],
  }
);

export default BibleVerse;
