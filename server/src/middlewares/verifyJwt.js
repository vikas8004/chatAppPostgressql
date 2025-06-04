import jsonwebtoken from "jsonwebtoken";
import ErrorResponse from "../lib/errorResponse.js";
import pool from "../lib/db.js";

export const verifyJwt = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return new ErrorResponse("No token provided", 401).send(res);   
    }
    
    jsonwebtoken.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
        return new ErrorResponse("Invalid token", 401).send(res);
        }
        //finding the user id from the decoded token and then finding the user in the database
        const email=decoded.email;
        const foundUser= await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (foundUser.rows.length === 0) {
            return new ErrorResponse("Invalid user info in the token", 404).send(res);
        }   
        req.user = foundUser.rows[0]; // Attach user info to the request object    
        next();
    });
}