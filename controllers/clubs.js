import connection from "../config/dbconnection.js";
import dotenv from "dotenv";
dotenv.config();
const db = await connection();

export const zone = async (req, res) => {
  const zoneName = req.zoneName;
  const regionName = req.regionName;
  const title = req.title;
  try {
    if (!title.includes("Zone Chairperson")) {
      return res.status(400).json({ message: "Not a zone chairperson" });
    }
    const sql = `
    SELECT u.clubName, u.clubId, u.regionName, u.zoneName,
           MAX(a.createdAt) AS latestActivity,
           COUNT(r.month) > 0 AS currentAdminReport
    FROM users u
    LEFT JOIN activities a ON u.clubId = a.clubId
    LEFT JOIN reporting r ON u.clubId = r.clubId AND r.month = MONTH(NOW())
    WHERE u.zoneName = ? AND u.regionName = ?
    GROUP BY u.clubId, u.clubName
  `;

    const [data] = await db.promise().query(sql, [zoneName, regionName]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const region = async (req, res) => {
  const regionName = req.regionName;
  const title = req.title;
  try {
    if (!title.includes("Region Chairperson")) {
      return res.status(400).json({ message: "Not a Region Chairperson" });
    }
    const sql = `
    SELECT u.clubName, u.clubId, u.regionName, u.zoneName,
           MAX(a.createdAt) AS latestActivity,
           COUNT(r.month) > 0 AS currentAdminReport
    FROM users u
    LEFT JOIN activities a ON u.clubId = a.clubId
    LEFT JOIN reporting r ON u.clubId = r.clubId AND r.month = MONTH(NOW())
    WHERE u.regionName = ?
    GROUP BY u.clubId, u.clubName, u.regionName, u.zoneName
  `;
    const [data] = await db.promise().query(sql, [regionName]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const clubsData = async (req, res) => {
  try {
    const sql = `SELECT clubs.clubName, clubs.clubId, clubs.regionName, clubs.zoneName, COUNT(users.id) AS totalMembers
      FROM clubs
      LEFT JOIN users ON clubs.clubId = users.clubId
      GROUP BY clubs.clubName, clubs.clubId, clubs.regionName, clubs.zoneName
      ORDER BY clubs.clubName;
      `;

    const [data] = await db.promise().query(sql);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const clubDetails = async (req, res) => {
  try {
    const { clubId } = req.query;
    if (!clubId) {
      return res.status(400).json({ message: "Club Id is required" });
    }
    const sql = `
    SELECT CONCAT(firstName,' ', middleName,' ', lastName) AS fullName, title, phone, clubName, profilePicture, CONCAT(address1,' ', address2) AS address1
    FROM users
    WHERE clubId = ? 
    AND (
        TRIM(title) LIKE '%President%' 
        OR TRIM(title) LIKE '%Administrator%' 
        OR TRIM(title) LIKE '%Secretary%' 
        OR TRIM(title) LIKE '%Treasurer%' 
        OR TRIM(title) LIKE '%Governor%'
    )
    ORDER BY fullName;       
  `;

    const [data] = await db.promise().query(sql, [clubId]);

    const sql2 = `SELECT clubName,clubId,about FROM clubs WHERE clubId = ?`;
    const [clubName] = await db.promise().query(sql2, [clubId]);
    if (clubName.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }
    const clubInfo = { pst: data, club: clubName[0] };
    return res.status(200).json(clubInfo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const addClubAbout = async (req, res) => {
  const clubId = req.clubId;
  const { about } = req.body;

  try {
    if (!clubId) {
      return res.status(400).json({ message: "Club Id is required" });
    }
    if (!about) {
      return res.status(400).json({ message: "About is required" });
    }
    const sql = `
    UPDATE clubs SET about = ? WHERE clubId = ?;
  `;
    const [data] = await db.promise().query(sql, [about, clubId]);
    if (data.affectedRows === 0) {
      return res.status(404).json({ message: "About not updated" });
    }

    return res
      .status(200)
      .json({ successMessage: "About updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const allClubs = async (req, res) => {
  try {
    const sql =
      "SELECT clubName, MAX(clubId) AS clubId FROM clubs GROUP BY clubName";
    const [data] = await db.promise().query(sql);
    const clubs = data.map((club) => ({ ...club, isChecked: false }));
    return res.status(200).json(clubs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const userTitles = async (req, res) => {
  try {
    const sql = "SELECT DISTINCT title FROM users";
    const [data] = await db.promise().query(sql);
    const titles = data.map((title) => ({ ...title, isChecked: false }));
    return res.status(200).json(titles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const downloadMemberData = async (req, res) => {
  try {
    const clubs = req.body.selectedClubs;
    const clubIds = clubs.map((club) => club.clubId);
    const titles = req.body.selectedTitles;
    const selectedTitles = titles
      .filter((title) => title.isChecked)
      .map((title) => title.title);
    if (clubs.length === 0) {
      return res.status(400).json({ message: "Please Select Club" });
    }
    // if (titles.length === 0) {
    //   return res.status(400).json({ message: "Please Select Titles" });
    // }
    let sql = `
      SELECT clubName,firstName,lastName,occupation,phone,regionName,zoneName,title FROM users 
      WHERE clubName IN (SELECT clubName FROM clubs WHERE clubId IN (?))
    `;
    let payload;
    if (titles.length === 0) {
      [payload] = await db.promise().query(sql, [clubIds]);
    } else {
      sql += `AND title IN (?)`;
      [payload] = await db.promise().query(sql, [clubIds, selectedTitles]);
    }

    if(payload.length === 0){
      return res.status(404).json({message:"No data found for given titles and clubs"})
    }
    
    return res
      .status(200)
      .json({ payload, successMessage: "Data Fetched Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getDistrictData = async (req, res) => {
  try {
    let sql;
    if (process.env.DOMAIN_URL.includes("lions317b.org")) {
      sql = `
    SELECT regionName, zoneName, clubName, clubId
    FROM clubs
    ORDER BY CAST(REGEXP_SUBSTR(regionName, '[0-9]+') AS SIGNED),zoneName,clubName;           
    `;
    } else {
      sql = `
    SELECT regionName, zoneName, clubName, clubId FROM clubs
    ORDER BY regionName, zoneName, clubName;
    `;
    }

    const [data] = await db.promise().query(sql);
    const districtData = [];

    for (const row of data) {
      if (row.regionName === "") {
        continue;
      }
      const region = districtData.find(
        (region) => region.name === row.regionName
      );

      if (!region) {
        let region_chairPerson = "";
        if (row.regionName.toLowerCase() !== "unassigned") {
          const sql1 = `SELECT firstname,middlename,lastname FROM users WHERE regionName = ? AND title LIKE '%Region Chairperson%'`;
          const [data] = await db.promise().query(sql1, [row.regionName]);
          if (data.length !== 0) {
            region_chairPerson =
              data[0].firstname +
              " " +
              data[0].middlename +
              " " +
              data[0].lastname;
          }
        }
        districtData.push({
          name: row.regionName,
          region_chairPerson: region_chairPerson,
          zones: [],
        });
      }

      const zone = districtData
        .find((region) => region.name === row.regionName)
        .zones.find((zone) => zone.name === row.zoneName);

      if (!zone) {
        let zone_chairPerson = "";
        if (
          row.zoneName.toLowerCase() !== "unassigned" &&
          row.zoneName.includes("Zone")
        ) {
          const sql1 = `SELECT firstname, middlename, lastname FROM users WHERE zoneName = ? AND regionName = ? AND title LIKE '%Zone Chairperson%'`;
          const [data] = await db
            .promise()
            .query(sql1, [row.zoneName, row.regionName]);
          if (data.length !== 0) {
            zone_chairPerson =
              data[0].firstname +
              " " +
              data[0].middlename +
              " " +
              data[0].lastname;
          }
        }
        districtData
          .find((region) => region.name === row.regionName)
          .zones.push({
            name: row.zoneName,
            zone_chairPerson: zone_chairPerson,
            clubs: [],
          });
      }

      const club = districtData
        .find((region) => region.name === row.regionName)
        .zones.find((zone) => zone.name === row.zoneName)
        .clubs.find((club) => club.id === row.clubId);

      if (!club) {
        districtData
          .find((region) => region.name === row.regionName)
          .zones.find((zone) => zone.name === row.zoneName)
          .clubs.push({
            name: row.clubName,
            id: row.clubId,
          });
      }
    }

    return res.status(200).json(districtData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
