// utils/ErrorResponse.js

class ErrorResponse extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }

  // Send error response using Express res object
  send(res) {
    return res.status(this.statusCode).json({
      success: false,
      error: this.message
    });
  }
}

export default ErrorResponse;
