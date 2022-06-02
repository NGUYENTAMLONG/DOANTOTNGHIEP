const { VALUES } = require("../config/default");

class SuccessResponse {
  constructor(message, data) {
    return {
      isSuccess: VALUES.IS_SUCCESS,
      message,
      data,
    };
  }
}

class ErrorResponse {
  constructor(errorCode, message) {
    return {
      isSuccess: VALUES.IS_FAILURE,
      errorCode,
      message,
    };
  }
}

module.exports = { SuccessResponse, ErrorResponse };
