import pool from "../lib/db.js";

// Function to create user table if it doesn't exist

export const createUserTable = async () => {
  const query = `
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_pic TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

  try {
    await pool.query(query);
  } catch (error) {
    console.error("Error creating user table:", error);
    throw error; // Rethrow the error for further handling
  }
};
