const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Add new fields to the Classes table
    await queryInterface.addColumn('Classes', 'description', {
      type: DataTypes.TEXT,
      allowNull: true
    });
    
    await queryInterface.addColumn('Classes', 'academicYear', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: new Date().getFullYear().toString()
    });
    
    await queryInterface.addColumn('Classes', 'semester', {
      type: DataTypes.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Classes', 'maxCapacity', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 25
    });
    
    await queryInterface.addColumn('Classes', 'currentEnrollment', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
    
    await queryInterface.addColumn('Classes', 'scheduleDay', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Sunday'
    });
    
    await queryInterface.addColumn('Classes', 'scheduleTime', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '10:00 AM'
    });
    
    await queryInterface.addColumn('Classes', 'location', {
      type: DataTypes.STRING,
      allowNull: true
    });
    
    await queryInterface.addColumn('Classes', 'isActive', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });
  },

  down: async (queryInterface) => {
    // Remove the new fields
    await queryInterface.removeColumn('Classes', 'description');
    await queryInterface.removeColumn('Classes', 'academicYear');
    await queryInterface.removeColumn('Classes', 'semester');
    await queryInterface.removeColumn('Classes', 'maxCapacity');
    await queryInterface.removeColumn('Classes', 'currentEnrollment');
    await queryInterface.removeColumn('Classes', 'scheduleDay');
    await queryInterface.removeColumn('Classes', 'scheduleTime');
    await queryInterface.removeColumn('Classes', 'location');
    await queryInterface.removeColumn('Classes', 'isActive');
  }
};
