import connection from "../../config/dbconnection.js";
const db = await connection();
import { uniqueName,writeFile } from "../../utils/index.js";
import path from "path";

const __dirname = path.dirname(
  new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")
);

export const getMember = async (req, res) => {
  try {
    const sql =
      "SELECT id, clubName, clubId, title, CONCAT(COALESCE(firstName, ''),' ', COALESCE(lastName, '')) AS fullName, CONCAT(address1, address2) AS address, city, email, phone, spouseName, dob, gender, occupation FROM users ORDER BY fullName";

    const [rows] = await db.promise().query(sql);

    const titleRank = {
      president: 1,
      "vice president": 2,
      secretary: 3,
      treasurer: 4,
      director: 5,
    };

    function getRank(title) {
      for (const keyword in titleRank) {
        if (title.includes(keyword)) {
          return titleRank[keyword];
        }
      }
      // If no keyword is found, assign a high rank
      return Infinity;
    }

    const sortedUsers = rows.sort((a, b) => {
      if (a.clubId !== b.clubId) {
        return a.clubId - b.clubId;
      }

      const titleA = a.title.toLowerCase();
      const titleB = b.title.toLowerCase();

      const rankA = getRank(titleA);
      const rankB = getRank(titleB);

      return rankA - rankB;
    });

    return res.status(200).json(sortedUsers);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error While Fetching Profile" });
  }
};

export const getRegions = async (req, res) => {
  try {
    const sql =
      "SELECT DISTINCT regionName FROM clubs AS regions ORDER BY regionName ASC;";
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
    const sql =
      "SELECT DISTINCT zoneName FROM clubs WHERE regionName =? ORDER BY zoneName ASC;";
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
      "SELECT DISTINCT clubName,clubId FROM clubs WHERE regionName = ? AND zoneName = ?;";
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
    !id ||
    !title ||
    !gender
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const titles = title.join("-");

    // Perform your database query or operation here
    const sql =
      "INSERT INTO users (clubName, clubId, regionName, title, zoneName, firstName, middleName, lastName, id, spouseName, dob, email, phone, gender, occupation, postalCode, state, city, address1, address2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      clubName,
      clubId,
      regionName,
      titles,
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


export const updateMemberInfo = async (req, res) => {

  const {
      id, 
    clubName,
    clubId,
    regionName,
    title,
    zoneName,
    firstName,
    middleName,
    lastName,
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

  if (!id) {
    return res.status(400).json({ message: "Missing memberId" });
  }
    // Check if required fields are present
    if (
      !clubId ||
      !clubName ||
      !regionName ||
      !zoneName ||
      !firstName ||
      !lastName ||
      !id ||
      title.length===0 ||
      !gender
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

  try {
  
    const titles = title.join("-");

   // check if member exists
    const sql1 = "SELECT id FROM users WHERE id = ?;";
    const [rows] = await db.promise().query(sql1, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }

    const sql =
      "UPDATE users SET clubName=?, clubId=?, regionName=?, title=?, zoneName=?, firstName=?, middleName=?, lastName=?, spouseName=?, dob=?, email=?, phone=?, gender=?, occupation=?, postalCode=?, state=?, city=?, address1=?, address2=? WHERE id=?";
    const values = [
      clubName,
      clubId,
      regionName,
      titles,
      zoneName,
      firstName,
      middleName,
      lastName,
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
      id,
    ];

    const [data ]= await db.promise().query(sql, values);
    
    if (data.affectedRows === 0) {
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res
      .status(200)
      .json({ successMessage: "Member information updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const memberDetails = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id ) {
      return res.status(400).json({ message: "Member id not provided" });
    }
    const sql =
      `SELECT clubName, clubId, regionName, title, zoneName, firstName, middleName, lastName, id, spouseName, dob, email, phone, gender, occupation, postalCode, state, city, address1, address2
      FROM users
      WHERE id = ?;
      `;
    const [data] = await db.promise().query(sql, [id]);
    if (data[0].length === 0) {
      return res.status(404).json({ message: "Member not found" });
    }
    const memberDetails = data[0];
    memberDetails.title = memberDetails.title.split("-").map((title) => title.trim());

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const monthlyAwards = async (req, res) => {
  
  const { awardTitle, date, description } = req.body;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }
    const fileName = uniqueName(req.file.originalname);
    const imagePath = `/images/monthlyAwards/${fileName}`;
    const folder = path.resolve(__dirname, "../..") + imagePath;
    await writeFile(folder, req.file.buffer);

    const sql =
      "INSERT INTO awards (title, date, description, image_path) VALUES (?, ?, ?, ?)";
    const [result] = await db
      .promise()
      .query(sql, [awardTitle, date, description, imagePath]);
    if (result.affectedRows === 1) {
      return res
        .status(200)
        .json({ successMessage: "Award added successfully" });
    }
    return res.status(400).json({ successMessage: "Award not added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAwards = async (req, res) => {
  try {
    const sql = `SELECT id, title, date, description, image_path as image FROM awards ORDER BY date DESC`;
    const [data] = await db.promise().query(sql);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteAward = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).json({ message: "id param is required" });
    }
    const sql = `DELETE FROM awards WHERE id = ?`;
    const [result] = await db.promise().query(sql, [id]);

    if (result.affectedRows === 1) {
      return res
        .status(200)
        .json({ successMessage: "Award deleted successfully" });
    } else {
      return res.status(404).json({ message: "Award not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "id param is required" });
    }

    const sql = "DELETE FROM users WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ successMessage: "Member Deleted Successfully" });
    } else {
      return res.status(400).json({ message: "Member Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
