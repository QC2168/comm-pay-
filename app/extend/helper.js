'use strict';
const cache = require('../utils/cache')
const cryptoService = require('../utils/cryptoService')
const jwt = require('../utils/jwt')
const uuid = require('../utils/uuid')
const bcrypt = require('bcryptjs');
module.exports = {
  ...cache,
  ...cryptoService,
  ...jwt,
  ...uuid,
    // 随机数
    randomInteger(minimum, maximum) {
      if (maximum === undefined) {
        maximum = minimum;
        minimum = 0;
      }
  
      if (typeof minimum !== 'number' || typeof maximum !== 'number') {
        throw new TypeError('Expected all arguments to be numbers');
      }
  
      return Math.floor(
        (Math.random() * (maximum - minimum + 1)) + minimum
      );
    },
    encryptPassword(password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      return hash;
    },
    checkPassword(password, hash) {
      return bcrypt.compareSync(password, hash);
    },
};
