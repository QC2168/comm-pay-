'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 添加新的字段 trade_password 到 users 表
    await queryInterface.addColumn('users', 'trade_password', {
      type: Sequelize.STRING(6), // 6位数的字符串
      allowNull: true, // 允许为空，因为这可能是一个新添加的字段
      comment: '交易密码'
    });
  },

  async down (queryInterface, Sequelize) {
    // 如果需要回滚，则删除 trade_password 字段
    await queryInterface.removeColumn('users', 'trade_password');
  }
};
