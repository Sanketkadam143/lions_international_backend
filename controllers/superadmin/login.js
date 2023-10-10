import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { passwordStrength } from "check-password-strength";
import validator from "validator";
import connection from "../../config/dbconnection.js";
import dotenv from "dotenv";
dotenv.config();
const db = await connection();

const JWTKEY = process.env.JWTKEY;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

export const adminSignIn = async (req, res) => {
  const { memberId, password } = req.body;

  try {
    const [admin] = await db
      .promise()
      .query(`SELECT * FROM super WHERE id=?`, [memberId]);
    if (admin.length === 0) {
      return res.status(404).json({ message: "Not a super admin" });
    }
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

    const token = jwt.sign(
      {
        title: rows[0].title,
        id: rows[0].id,
        clubName: rows[0].clubName,
        clubId: rows[0].clubId,
        firstName: rows[0].firstName,
        lastName: rows[0].lastName,
        picture: rows[0].profilePicture,
        regionName: rows[0].regionName,
        zoneName: rows[0].zoneName,
        email: rows[0].email,
        phone: rows[0].phone,
        detailsRequired: rows[0].verified === 1 ? false : true,
        role:"superadmin",
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
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
