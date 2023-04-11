import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { passwordStrength } from "check-password-strength";
import validator from "validator";
import connection from "../config/dbconnection.js";
import dotenv from "dotenv";
dotenv.config();
const db = await connection();

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

    const token = jwt.sign(
      {
        title: rows[0].title,
        id: rows[0].id,
        clubName: rows[0].clubName,
        clubId: rows[0].clubId,
        firstName: rows[0].firstName,
        lastName: rows[0].lastName,
        picture:rows[0].profilePicture,
        regionName:rows[0].regionName,
        zoneName:rows[0].zoneName,
        email:rows[0].email,
        phone:rows[0].phone,
        detailsRequired: rows[0].verified === 1 ? false : true,
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
    console.log(error)
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const userId = req.userId;
  const { password, confirmPassword } = req.body;
  try {
    const passMusthave = ["lowercase", "uppercase", "symbol", "number"];

    const passContains = passwordStrength(password).contains;

    var addPass = [];
    passMusthave.map((x) => !passContains.includes(x) && addPass.push(x));

    const strength = passwordStrength(password).value;
    const length = passwordStrength(password).length;

    if (length < 8)
      return res
        .status(400)
        .json({ message: `Add password of length greater than 8` });

    if (strength === "Too weak" || strength === "Weak")
      return res.status(400).json({
        message: `Entered Password is ${strength} consider adding ${addPass.map(
          (x) => x
        )}`,
      });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords Don't Match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db
      .promise()
      .query("UPDATE users SET password = ? WHERE id = ?", [
        hashedPassword,
        userId,
      ]);
    if (result.changedRows > 0) {
      return res
        .status(200)
        .json({ successMessage: "Password Change Successfully" });
    } else {
      return res
        .status(500)
        .json({ message: "Something went wrong try again" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (user.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    
    await db.promise().query("UPDATE users SET reset_token = ? WHERE id = ?", [token, user[0].id]);

    const resetLink = `https://example.com/reset-password?token=${token}`;
   
   // await sendMail(resetLink,email);

    return res.status(200).json({ message: "Email sent with reset password link" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
