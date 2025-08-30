const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    // Add new fields to the LessonPlans table
    await queryInterface.addColumn('LessonPlans', 'content', {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    });
    
    await queryInterface.addColumn('LessonPlans', 'bibleReference', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    });
    
    await queryInterface.addColumn('LessonPlans', 'keyPoints', {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: []
    });
    
    await queryInterface.addColumn('LessonPlans', 'objectives', {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    });
    
    await queryInterface.addColumn('LessonPlans', 'duration', {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 45
    });
    
    await queryInterface.addColumn('LessonPlans', 'status', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'draft'
    });
    
    await queryInterface.addColumn('LessonPlans', 'publishDate', {
      type: DataTypes.DATE,
      allowNull: true
    });
  },

  down: async (queryInterface) => {
    // Remove the new fields
    await queryInterface.removeColumn('LessonPlans', 'content');
    await queryInterface.removeColumn('LessonPlans', 'bibleReference');
    await queryInterface.removeColumn('LessonPlans', 'keyPoints');
    await queryInterface.removeColumn('LessonPlans', 'objectives');
    await queryInterface.removeColumn('LessonPlans', 'duration');
    await queryInterface.removeColumn('LessonPlans', 'status');
    await queryInterface.removeColumn('LessonPlans', 'publishDate');
  }
};
