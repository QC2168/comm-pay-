'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 向 users 表中添加 balance 字段
    await queryInterface.addColumn('users', 'balance', {
      type: Sequelize.DECIMAL(10, 2), // 精度为10位，其中2位是小数
      allowNull: false,
      defaultValue: 0.00, // 默认值为0.00
    });
  },

  async down (queryInterface, Sequelize) {
    // 如果需要回滚，则删除 balance 字段
    await queryInterface.removeColumn('users', 'balance');
  }
};
