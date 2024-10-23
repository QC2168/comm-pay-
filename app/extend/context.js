'use strict';
module.exports = {
  resultData(message,data = {}) {
    return  {
      data,
      message,
    };
  },
  resultErrorData(message, errors = null) {
    return {
      errors,
      message,
    };
  }
};
