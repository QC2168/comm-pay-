'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('bank_cards', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '用户ID'
      },
      bank_branch: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '银行卡所属分行'
      },
      card_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // 银行卡号应该是唯一的
        comment: '银行卡号'
      },
      holder_name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '姓名（持卡人）'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('bank_cards');
  }
};
