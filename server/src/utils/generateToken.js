import jsonwebtoken from "jsonwebtoken";

export const generateToken = (payload, res) => {
  const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d" // Token will expire in 7 days
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });
  return token;
};
