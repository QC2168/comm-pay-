'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, NOW } = app.Sequelize;

  const BankCards = app.model.define('BankCards', {
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
    bankBranch: {
      type: STRING,
      allowNull: false,
      comment: '银行卡所属分行'
    },
    cardNumber: {
      type: STRING,
      allowNull: false,
      unique: true, // 银行卡号应该是唯一的
      comment: '银行卡号'
    },
    holderName: {
      type: STRING,
      allowNull: false,
      comment: '姓名（持卡人）'
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

  return BankCards;
};
