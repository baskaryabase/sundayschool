import { DataTypes, QueryInterface } from 'sequelize';

// Migration name: create-bible-verses-table
const migration = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable('BibleVerses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });

    // Add indexes
    await queryInterface.addIndex('BibleVerses', ['reference']);
    await queryInterface.addIndex('BibleVerses', ['language']);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('BibleVerses');
  },
};

export default migration;
