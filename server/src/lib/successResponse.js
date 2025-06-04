// utils/ApiResponse.js

class ApiResponse {
  constructor(data = null, message = "Success", statusCode = 200) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  // Helper method to send the response via Express res object
  send(res) {
    return res.status(this.statusCode).json({
      success: this.statusCode >= 200 && this.statusCode < 300,
      message: this.message,
      data: this.data
    });
  }
}

export default ApiResponse;
