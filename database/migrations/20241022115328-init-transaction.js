'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('withdrawals', {
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
      amount: {
        type: Sequelize.DECIMAL(10, 2), // 假设金额精度为两位小数
        allowNull: false,
        comment: '提现金额'
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '提现状态'
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: '备注（驳回失败的时候显示的，可为空）'
      },
      bank_card_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '提现银行卡ID'
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
    await queryInterface.dropTable('withdrawals');
  }
};
