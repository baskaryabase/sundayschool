const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Add new fields to the Users table
    await queryInterface.addColumn('Users', 'phone', {
      type: DataTypes.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'address', {
      type: DataTypes.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'city', {
      type: DataTypes.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'state', {
      type: DataTypes.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'zipCode', {
      type: DataTypes.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'dateOfBirth', {
      type: DataTypes.DATE,
      allowNull: true
    });
    
    await queryInterface.addColumn('Users', 'isActive', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
    
    await queryInterface.addColumn('Users', 'lastLoginAt', {
      type: DataTypes.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface) => {
    // Remove the new fields
    await queryInterface.removeColumn('Users', 'phone');
    await queryInterface.removeColumn('Users', 'address');
    await queryInterface.removeColumn('Users', 'city');
    await queryInterface.removeColumn('Users', 'state');
    await queryInterface.removeColumn('Users', 'zipCode');
    await queryInterface.removeColumn('Users', 'dateOfBirth');
    await queryInterface.removeColumn('Users', 'isActive');
    await queryInterface.removeColumn('Users', 'lastLoginAt');
  }
};
