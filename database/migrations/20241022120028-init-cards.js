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
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '用户ID'
      },
      bankBranch: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '银行卡所属分行'
      },
      cardNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // 银行卡号应该是唯一的
        comment: '银行卡号'
      },
      holderName: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '姓名（持卡人）'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('bank_cards');
  }
};
