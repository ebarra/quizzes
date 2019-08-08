'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('users', [
      {
        name: 'Peter',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Anna',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
  }
};