import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { passwordStrength } from "check-password-strength";
import validator from "validator";
import connection from "../config/dbconnection.js";
import dotenv from "dotenv";
dotenv.config();
const db = connection();

const JWTKEY = process.env.JWTKEY;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

export const signIn = async (req, res) => {
  const { memberId, password } = req.body;
  
  try {
    const [rows] = await db
      .promise()
      .query(`SELECT * FROM users WHERE id = ?`, [memberId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Member does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, rows[0].password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Password" });
    }
   const detailsRequired = rows[0].email !==null ? false:true;
    const token = jwt.sign(
      {
        title: rows[0].title,
        id: rows[0].id,
        clubName: rows[0].clubName,
        firstName: rows[0].firstName,
        lastName:rows[0].lastName,
        detailsRequired:detailsRequired,
      },
      JWTKEY,
      {
        expiresIn: JWT_EXPIRE,
      }
    );
    return res.status(200).json({
      token,
      successMessage: "You are Successfully Logged in",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};