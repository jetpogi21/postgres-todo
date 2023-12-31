//Generated by GenerateTimestampMigrationFile
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('taskmanager_taskinterval', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });

    await queryInterface.addColumn('taskmanager_taskinterval', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('taskmanager_taskinterval', 'createdAt');
    await queryInterface.removeColumn('taskmanager_taskinterval', 'updatedAt');
  }
};
