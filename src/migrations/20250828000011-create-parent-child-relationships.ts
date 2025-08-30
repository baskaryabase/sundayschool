const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('ParentChildRelationships', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      childId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      relationship: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isPrimary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });

    // Add unique constraint to prevent duplicate relationships
    await queryInterface.addConstraint('ParentChildRelationships', {
      fields: ['parentId', 'childId'],
      type: 'unique',
      name: 'unique_parent_child_relationship'
    });

    // Add indexes for faster lookup
    await queryInterface.addIndex('ParentChildRelationships', ['parentId']);
    await queryInterface.addIndex('ParentChildRelationships', ['childId']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ParentChildRelationships');
  }
};
