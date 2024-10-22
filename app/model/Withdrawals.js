'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW, DECIMAL } = app.Sequelize;

  const Withdrawals = app.model.define('Withdrawals', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: INTEGER,
      allowNull: false,
      comment: '用户ID'
    },
    amount: {
      type: DECIMAL(10, 2), // 假设金额精度为两位小数
      allowNull: false,
      comment: '提现金额'
    },
    status: {
      type: STRING,
      allowNull: true,
      comment: '提现状态'
    },
    note: {
      type: STRING,
      allowNull: true,
      comment: '备注（驳回失败的时候显示的，可为空）'
    },
    bankCardId: {
      type: INTEGER,
      allowNull: false,
      comment: '提现银行卡ID'
    },
    createdAt: {
      allowNull: false,
      type: DATE,
      defaultValue: NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DATE,
      defaultValue: NOW,
    }
  });

  return Withdrawals;
};
