import connection from "../config/dbconnection.js";
import sharp from "sharp";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWTKEY = process.env.JWTKEY;
const JWT_EXPIRE = process.env.JWT_EXPIRE;
const db = await connection();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const memberProfile = async (req, res) => {
  const id = req.userId;
  try {
    const sql =
      "SELECT regionName,zoneName,title,clubName,clubId,profilePicture,firstName, middleName, lastName, address1, address2, city, state, postalCode, email, phone, spouseName, dob, gender, occupation FROM users WHERE id=?";
    const data = await db.promise().query(sql, [id]);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error While Fetching Profile" });
  }
};
export const updateProfile = async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    address1,
    address2,
    city,
    state,
    postalCode,
    email,
    phone,
    spouseName,
    dob,
    occupation,
    gender,
  } = req.body;
  const clubId = req.clubId;
  const id = req.userId;
  let imagePath;

  try {
    if (req.file) {
      const extension = path.extname(req.file.originalname);
      const newFileName = `${firstName}${lastName}${extension}`;
      imagePath = `/images/profile/${newFileName}`;
      const folder = path.resolve(__dirname, "..") + imagePath;
      await sharp(req.file.buffer).png().toFile(folder);
    }
    const userData = {
      firstName,
      middleName,
      lastName,
      address1,
      address2,
      city,
      state,
      postalCode,
      email,
      phone,
      spouseName,
      dob,
      occupation,
      gender,
    };

    const sql = `UPDATE users 
           SET firstName = ?,
               middleName = ?,
               lastName = ?,
               address1 = ?,
               address2 = ?,
               city = ?,
               state = ?,
               postalCode = ?,
               email = ?,
               phone = ?,
               spouseName = ?,
               dob = ?,
               occupation = ?,
               gender = ?${req.file ? ", profilePicture=?" : ""}
           WHERE id = ?`;

    const userDataValues = [...Object.values(userData)];
    if (req.file) {
      userDataValues.push(imagePath);
    }
    userDataValues.push(id);

    await db.promise().query(sql, userDataValues);

    const sql2 = `SELECT title,id,clubName,clubId,firstName,lastName,profilePicture,verified FROM users WHERE id=?`;
    const [rows] = await db.promise().query(sql2, [id]);
    const token = jwt.sign(
      {
        title: rows[0].title,
        id: rows[0].id,
        clubName: rows[0].clubName,
        clubId: rows[0].clubId,
        firstName: rows[0].firstName,
        lastName: rows[0].lastName,
        picture: rows[0].profilePicture,
        detailsRequired: rows[0].verified === 1 ? false : true,
      },
      JWTKEY,
      {
        expiresIn: JWT_EXPIRE,
      }
    );

    return res
      .status(200)
      .json({ token, successMessage: "Profile Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
