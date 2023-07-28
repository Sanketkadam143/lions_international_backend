import connection from "../../config/dbconnection.js";
const db = await connection();

export const getMember = async (req, res) => {
  try {
    const sql =
      "SELECT id, clubName, clubId, title, CONCAT(COALESCE(firstName, ''),' ', COALESCE(lastName, '')) AS fullName, CONCAT(address1, address2) AS address, city, email, phone, spouseName, dob, gender, occupation FROM users ORDER BY fullName";

    const [rows] = await db.promise().query(sql);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error While Fetching Profile" });
  }
};



export const getRegions = async (req, res) => {
  try {
    const sql = "SELECT DISTINCT regionName FROM users AS regions;";
    const data = await db.promise().query(sql);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getZones = async (req, res) => {
  const regionName = req.query.region;
  try {
    const sql = "SELECT DISTINCT zoneName FROM users WHERE regionName =?;";
    const data = await db.promise().query(sql, [regionName]);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getClub = async (req, res) => {
  const regionName = req.query.region;
  const zoneName = req.query.zone;
  try {
    const sql =
      "SELECT DISTINCT clubName,clubId FROM users WHERE regionName = ? AND zoneName = ?;";
    const data = await db.promise().query(sql, [regionName, zoneName]);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const checkMemberId = async (req, res) => {
  const id = req.query.id;

  try {
    const sql = "SELECT id FROM users WHERE id = ?;";
    const [rows] = await db.promise().query(sql, [id]);

    if (rows.length === 0) {
      return res
        .status(200)
        .json({ successMessage: `Member ID ${id} is available to use.` });
    } else {
      return res
        .status(400)
        .json({ message: `Member with ID ${id} already exists.` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const addMember = async (req, res) => {
  const {
    clubName,
    clubId,
    regionName,
    title,
    zoneName,
    firstName,
    middleName,
    lastName,
    id,
    spouseName,
    dob,
    email,
    phone,
    gender,
    occupation,
    postalCode,
    state,
    city,
    address1,
    address2,
  } = req.body;

  // Check if required fields are present
  if (
    !clubId ||
    !clubName ||
    !regionName ||
    !zoneName ||
    !firstName ||
    !lastName ||
    !email ||
    !id ||
    !title ||
    !phone ||
    !gender
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Perform your database query or operation here
    const sql =
      "INSERT INTO users (clubName, clubId, regionName, title, zoneName, firstName, middleName, lastName, id, spouseName, dob, email, phone, gender, occupation, postalCode, state, city, address1, address2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      clubName,
      clubId,
      regionName,
      title,
      zoneName,
      firstName,
      middleName,
      lastName,
      id,
      spouseName,
      dob,
      email,
      phone,
      gender,
      occupation,
      postalCode,
      state,
      city,
      address1,
      address2,
    ];
    const data = await db.promise().query(sql, values);

    return res
      .status(200)
      .json({ successMessage: "Member added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
