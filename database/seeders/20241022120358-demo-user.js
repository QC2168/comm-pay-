'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [{
      username: 'administrator',
      mobile: '18600000000',
      role: 'admin',
      password: '$2a$10$KziX2AcIo46guj/mSa9WoO7h3UPe97r.QFm0R8z1jsfWh0TOpuhba',
      created_at: new Date(),
      updated_at: new Date(),
    }]);
    await queryInterface.bulkInsert('users', [
      {
        username: 'island',
        mobile: '18600000000',
        role: 'admin',
        password: '$2a$10$KziX2AcIo46guj/mSa9WoO7h3UPe97r.QFm0R8z1jsfWh0TOpuhba',
        created_at: new Date(),
        updated_at: new Date(),
      }]);


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
