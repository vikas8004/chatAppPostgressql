import pool from "../lib/db.js";
import ErrorResponse from "../lib/errorResponse.js";
import ApiResponse from "../lib/successResponse.js";
import asyncHanlder from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { uploadImageToCloudinary } from "../utils/uploadOnCloudinary.js";
import bcryptjs from "bcryptjs";

// Register user
export const register = asyncHanlder(async (req, res, next) => {
  try {
    const { full_name, email, password } = req.body;
    const profile_pic = req.file ? req.file : null;
    //checking if the user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return new ErrorResponse("User already exists.", 400).send(res);
    }

    // Insert new user into the database
    const uploadedProfilePic = await uploadImageToCloudinary(profile_pic);
    if (!uploadedProfilePic) {
      return new ErrorResponse("Image upload failed", 500).send(res);
    }
    const { secure_url } = uploadedProfilePic;
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = await pool.query(
      "INSERT INTO users (full_name, email, password, profile_pic) VALUES ($1, $2, $3, $4) RETURNING full_name,email, profile_pic,created_at,id",
      [full_name, email, hashedPassword, secure_url]
    );

    return new ApiResponse(
      newUser.rows[0],
      "User Registered Successfully",
      201
    ).send(res);
  } catch (error) {
    next(error);
  }
});

// Login user
export const login = asyncHanlder(async (req, res, next) => {
  // Logic for user login
  try {
    const { email, password } = req.body;

    // Check if user exists
    const foundUser = await pool.query("select * from users where email=$1", [
      email
    ]);
    if (foundUser.rows.length === 0) {
      return new ErrorResponse("Invalied credentials", 401).send(res);
    }
    // Check password
    const isPasswordValid = await bcryptjs.compare(
      password,
      foundUser.rows[0].password
    );
    if (!isPasswordValid) {
      return new ErrorResponse("Invalied credentials", 401).send(res);
    }
    // Return user data excluding password
    const { password: _, ...userData } = foundUser.rows[0];
    userData.token = generateToken(
      { id: userData.id, email: userData.email },
      res
    );
    return new ApiResponse(userData, "User logged in successfully", 200).send(
      res
    );
  } catch (error) {
    next(error);
  }
});

// Logout user
export const logout = asyncHanlder(async (req, res, next) => {
  // Logic for user logout
  const user = req.user;
  if (!user) {
    return new ErrorResponse("User not found", 404).send(res);
  }
  // Clear the token cookie
  res.cookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 0 // Set maxAge to 0 to delete the cookie
  });
  return new ApiResponse(null, "User logged out successfully", 200).send(res);
});

// Update user Profile
export const updateProfile = asyncHanlder(async (req, res, next) => {
  const user = req.user;
  const { id, email } = user;
  const profile_pic = req.file ? req.file : null;
  // console.log(profile_pic);

  // Check if the user exists
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND id = $2",
    [email, id]
  );
  if (!existingUser.rows.length) {
    return new ErrorResponse("Invalid user or password", 400).send(res);
  }
  // Update user profile
  const uploadedProfilePic = await uploadImageToCloudinary(profile_pic);
  if (!uploadedProfilePic) {
    return new ErrorResponse("Image upload failed", 500).send(res);
  }
  const { secure_url } = uploadedProfilePic;

  // Update user profile in the database
  const updatedUser = await pool.query(
    "UPDATE users SET profile_pic = $1 WHERE id = $2 and email=$3 RETURNING full_name, email, profile_pic, created_at, id",
    [secure_url, id, email]
  );
  if (!updatedUser.rows.length) {
    return new ErrorResponse("Failed to update profile", 500).send(res);
  }
  return new ApiResponse(
    updatedUser.rows[0],
    "Profile updated successfully",
    200
  ).send(res);
});

// check if user is authenticated
export const isAuthenticated = asyncHanlder(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return new ErrorResponse("User not authenticated", 401).send(res);
  }
  return new ApiResponse(user, "User is authenticated", 200).send(res);
});
