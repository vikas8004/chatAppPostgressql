import pool from "../lib/db.js";

// Function to create messages table if it doesn't exist

export const createMessagesTable = async () => {
  const query = `
            CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            sender_id INT NOT NULL,
            receiver_id INT NOT NULL,
            message TEXT NOT NULL,
            file_url TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
            );
        `;

  try {
    await pool.query(query);
  } catch (error) {
    console.error("Error creating messages table:", error);
    throw error; // Rethrow the error for further handling
  }
};
