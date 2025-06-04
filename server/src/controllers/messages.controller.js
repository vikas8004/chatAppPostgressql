import ApiResponse from "../lib/successResponse.js";
import asyncHanlder from "../utils/asyncHandler.js";
import pool from "../lib/db.js";
import ErrorResponse from "../lib/errorResponse.js";
import { uploadImageToCloudinary } from "../utils/uploadOnCloudinary.js";
import { GetReceiverSocketId, io } from "../lib/socket.js";

//getting users for messages
export const getUsersForMessages = asyncHanlder(async (req, res) => {
  const { id } = req.user;
  const query = `
        SELECT u.id, u.full_name, u.email, u.profile_pic
        FROM users u
        WHERE u.id != $1
        ORDER BY u.full_name ASC;
    `;
  const foundUsers = await pool.query(query, [id]);
  if (foundUsers.rows.length === 0) {
    return new ErrorResponse("No users found", 404).send(res);
  }
  return new ApiResponse(
    foundUsers.rows,
    "Users fetched successfully",
    200
  ).send(res);
});

//getting messages by user id
export const getMessagesByUserId = asyncHanlder(async (req, res) => {
  try {
    const { id: receiver_id } = req.params; // receiver_id
    const { id: sender_id } = req.user; // sender_id from the authenticated user

    // getting the messages between sender and receiver
    const query = `
      SELECT m.id, m.sender_id, m.receiver_id, m.message, m.file_url, m.timestamp,
             u.full_name AS sender_name, u.profile_pic AS sender_profile_pic,u.email AS sender_email
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE (m.sender_id = $1 AND m.receiver_id = $2)
         OR (m.sender_id = $2 AND m.receiver_id = $1)
      ORDER BY m.timestamp ASC;
    `;

    const messages = await pool.query(query, [sender_id, receiver_id]);
    return new ApiResponse(
      messages.rows,
      "Messages fetched successfully",
      200
    ).send(res);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new ErrorResponse("Failed to fetch messages", 500).send(res);
  }
});

// sending messages
export const sendMessages = asyncHanlder(async (req, res) => {
  try {
    const { id: receiver_id } = req.params; // receiver_id
    const { id: sender_id } = req.user; // sender_id from the authenticated user
    const { message } = req.body;
    console.log("messages", message);

    const file = req.file; // file uploaded by multer middleware;

    if (!message && !file) {
      return new ErrorResponse("Message or file is required", 400).send(res);
    }

    let file_url = null;
    if (file) {
      try {
        const uploadResult = await uploadImageToCloudinary(file);
        file_url = uploadResult.secure_url; // Get the URL of the uploaded file
      } catch (error) {
        console.error("Error uploading file:", error);
        return new ErrorResponse("File upload failed", 500).send(res);
      }
    }

    const query = `
    INSERT INTO messages (sender_id, receiver_id, message, file_url)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

    const values = [sender_id, receiver_id, message || null, file_url || null];
    // console.log("values", values);
    const result = await pool.query(query, values);

    // realtime message sending logic can be added here, e.g., using WebSockets

    const receiverSocketId = GetReceiverSocketId(receiver_id);
    if (receiverSocketId) {
      // Emit the new message to the receiver's socket
      io.to(receiverSocketId).emit("newMessage", result.rows[0]);
    }
    return new ApiResponse(
      result.rows[0],
      "Message sent successfully",
      201
    ).send(res);
  } catch (error) {
    console.error("Error sending message:", error);
    return new ErrorResponse("Failed to send message", 500).send(res);
  }
});
