'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 添加 card_photo 字段到 bank_cards 表
    await queryInterface.addColumn(
      'bank_cards', // 表名
      'card_photo', // 新字段名
      {
        type: Sequelize.STRING, // 字段类型，可以是 STRING 或 BLOB
        allowNull: true, // 允许为空
        comment: '银行卡照片' // 字段注释
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // 移除 card_photo 字段
    await queryInterface.removeColumn(
      'bank_cards',
      'card_photo'
    );
  }
};
