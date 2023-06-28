import connection from "../../config/dbconnection.js";
const db = await connection();

export const getMember = async (req, res) => {
  const {
    id,
    clubName,
    clubId,
    title,
    firstName,
    middleName,
    lastName,
    address1,
    address2,
    city,
    email,
    phone,
    spouseName,
    dob,
    gender,
    occupation
  } = req.body;
  
  try {
    const sql =
      "SELECT id, clubName, clubId, title, CONCAT(firstName, middleName, lastName) AS fullName, CONCAT(address1, address2) AS address, city, email, phone, spouseName, dob, gender, occupation FROM users";
    const params = [
      id,
      clubName,
      clubId,
      title,
      firstName,
      middleName,
      lastName,
      address1,
      address2,
      city,
      email,
      phone,
      spouseName,
      dob,
      gender,
      occupation
    ];

    const [rows] = await db.promise().query(sql, params);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error While Fetching Profile" });
  }
};


