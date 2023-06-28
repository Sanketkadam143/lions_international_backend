import connection from "../config/dbconnection.js";
import sharp from "sharp";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWTKEY = process.env.JWTKEY;
const JWT_EXPIRE = process.env.JWT_EXPIRE;
const db = await connection();
const __dirname = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, '$1'));

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
  const verified=1;
  let imagePath;

  try {
    if (req.file) {
      const extension = ".png";
      const newFileName = `${firstName.toLowerCase()}${lastName.toLowerCase()}${extension}`;
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
      verified,
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
               gender = ?,
               verified = ?
               ${req.file ? ", profilePicture=?" : ""}
           WHERE id = ?`;

    const userDataValues = [...Object.values(userData)];
    if (req.file) {
      userDataValues.push(imagePath);
    }
    userDataValues.push(id);

    await db.promise().query(sql, userDataValues);

    const sql2 = `SELECT title,id,clubName,clubId,firstName,lastName,profilePicture,verified,regionName,zoneName FROM users WHERE id=?`;
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
        regionName: rows[0].regionName,
        zoneName: rows[0].zoneName,
        email:rows[0].email,
        phone:rows[0].phone,
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

export const clubMembers = async (req, res) => {
  const clubId = req.clubId;
  try {
    const sql =
      "SELECT title,firstName,lastName,clubName,dob FROM users WHERE clubId=?";
    const data = await db.promise().query(sql, [clubId]);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error While Fetching club Members" });
  }
};

// export const MemberDirectory=async(req,res)=>{
//   const clubId = req.clubId;
//     const page = req.query.page || 1;
//     const offset = (page - 1) * 100;
//   try{
//     let sql = ` SELECT title, CONCAT(firstName, middleName, lastName) AS fullName, clubName, Occupation
//       FROM users
//       LIMIT 1000
//       OFFSET ${offset} `;
//     if (clubId) {
//       sql = `
//         SELECT title, CONCAT(firstName, middleName, lastName) AS fullName, clubName, Occupation
//         FROM users
//         WHERE clubId = ${clubId}
//         LIMIT 1000
//         OFFSET ${offset}
//       `;
//     }
//     const data = await db.promise().query(sql);
//     return res.status(200).json(data[0]);
//   }
//   catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ message: "Error While Fetching club Members" });
//   }
// }
export const MemberDirectory = async (req, res) => {
  try {
    const sql = `
      SELECT CONCAT(firstName, middleName, lastName) AS fullName, title, phone, clubName, profilePicture
      FROM users Limit 20;
    `;
    const data = await db.promise().query(sql);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error While Fetching Business Members" });
  }
}

