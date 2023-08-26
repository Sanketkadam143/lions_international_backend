import connection from "../config/dbconnection.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { uniqueName, writeFile } from "../utils/index.js";
const db = await connection();

const __dirname = path.dirname(
  new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")
);

export const getClubDirector = async (req, res) => {
  try {
    const clubId = req.clubId;
    const sql =
      "SELECT name AS fullName FROM cabinet_officers ORDER BY fullName ASC";
    const data = await db.promise().query(sql, [clubId]);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getActivity = async (req, res) => {
  try {
    const sql = "SELECT distinct type FROM activitytype";
    const data = await db.promise().query(sql);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getSubtype = async (req, res) => {
  try {
    const { type } = req.query;
    const searchTerm = `%${type.trim()}%`;
    const sql = `SELECT DISTINCT subtype FROM activitytype WHERE type LIKE ?`;
    const [data] = await db.promise().query(sql, [searchTerm]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { subtype, type } = req.query;
    const searchTerm1 = `%${subtype.trim()}%`;
    const searchTerm2 = `%${type.trim()}%`;
    const sql = `SELECT DISTINCT category FROM activitytype WHERE subtype LIKE ? and type LIKE ?`;
    const [data] = await db.promise().query(sql, [searchTerm1, searchTerm2]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPlaceholder = async (req, res) => {
  try {
    const { category, type, subtype } = req.query;

    const searchTerm1 = `%${category.trim()}%`;
    const searchTerm2 = `%${type.trim()}%`;
    const searchTerm3 = `%${subtype.trim()}%`;
    const sql = `SELECT  placeholder FROM activitytype WHERE category LIKE ? and type LIKE ? and subtype LIKE ?`;
    const [data] = await db
      .promise()
      .query(sql, [searchTerm1, searchTerm2, searchTerm3]);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getReportedActivity = async (req, res) => {
  let clubId = req.clubId;
  if (req.query.clubId) clubId = req.query.clubId;
  try {
    const sql = `SELECT * FROM activities WHERE clubId=?`;
    const [activities] = await db.promise().query(sql, [clubId]);

    for (const activity of activities) {
      const registerSql = `SELECT * FROM register WHERE activityId=?`;
      const [registrations] = await db
        .promise()
        .query(registerSql, [activity.activityId]);
      activity.registrations = registrations;
    }

    return res.status(200).json(activities);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteActivity = async (req, res) => {
  const { activityId } = req.query;
  const clubId = req.clubId;
  try {
    const sql2 = `SELECT activityStars FROM activities WHERE activityId=?`;
    const [activityCategoryData] = await db.promise().query(sql2, [activityId]);
    if (activityCategoryData.length === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const activityStars = activityCategoryData[0]?.activityStars;

    await db
      .promise()
      .query(
        "UPDATE clubs SET activitystar = activitystar - ? WHERE clubId = ?;",
        [activityStars, clubId]
      );

    const sql = `DELETE FROM activities WHERE activityId = ?`;
    const [result] = await db.promise().query(sql, [activityId]);

    if (result.affectedRows === 1) {
      return res
        .status(200)
        .json({ successMessage: `Activity deleted successfully with points ${activityStars}`});
    } else {
      return res.status(404).json({ message: "Activity not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const editActivity = async (req, res) => {
  const {
    amount,
    activityTitle,
    city,
    date,
    cabinetOfficers,
    description,
    lionHours,
    mediaCoverage,
    activityType,
    activitySubType,
    activityCategory,
    place,
    placeholder,
    activityId,
  } = req.body;
  const clubId = req.clubId;
  try {
    let image_path = "";
    if (req.files?.[0]) {
      const fileName = uniqueName(req.files[0].originalname);
      image_path = `/images/activity/${fileName}`;
      const folder = path.resolve(__dirname, "..") + image_path;
      await writeFile(folder, req.files[0].buffer);
    }

    let image_path2 = "";
    if (req.files?.[1]) {
      const fileName = uniqueName(req.files[1].originalname);
      image_path2 = `/images/activity/${fileName}`;
      const folder = path.resolve(__dirname, "..") + image_path2;
      await writeFile(folder, req.files[1].buffer);
    }

    const sql2 = `SELECT activityStars FROM activities WHERE activityId=?`;
    const [activityCategoryData] = await db.promise().query(sql2, [activityId]);
    if (activityCategoryData.length === 0) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const prevActivityStars = activityCategoryData[0]?.activityStars;

    const sql3 = `
    SELECT star
    FROM activitytype
    WHERE TRIM(category) LIKE ? AND TRIM(subtype) LIKE ? AND TRIM(type) LIKE ?
  `;

    const [rows] = await db
      .promise()
      .query(sql3, [
        `%${activityCategory.trim()}%`,
        `%${activitySubType.trim()}%`,
        `%${activityType.trim()}%`,
      ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Activity star type not found" });
    }

    const activityStars = rows[0]?.star;
    
    let updateFields = {
      amount,
      activityTitle,
      city,
      date,
      cabinetOfficers,
      description,
      lionHours,
      mediaCoverage,
      activityType,
      activitySubType,
      activityCategory,
      place,
      activityStars,
      placeholder,
    };

    if (image_path) {
      updateFields.image_path = image_path;
    }

    if (image_path2) {
      updateFields.image_path2 = image_path2;
    }

    await db.promise().query(
      `
      UPDATE clubs
      SET activitystar = activitystar - ? + ?
      WHERE clubId = ?;
      `,
      [prevActivityStars, activityStars, clubId]
    );
    

    // Update the activity with the given activityId
    await db
      .promise()
      .query("UPDATE activities SET ? WHERE activityId = ?", [
        updateFields,
        activityId,
      ]);

    return res
      .status(200)
      .json({ successMessage: `Activity ${activityId} updated successfully with points ${activityStars}` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const addActivity = async (req, res) => {
  const {
    amount,
    activityTitle,
    city,
    date,
    cabinetOfficers,
    description,
    lionHours,
    mediaCoverage,
    activityType,
    activitySubType,
    activityCategory,
    place,
    placeholder,
  } = req.body;

  const clubId = req.clubId;

  try {
    const fileName = uniqueName(req.files[0].originalname);
    const image_path = `/images/activity/${fileName}`;
    const folder = path.resolve(__dirname, "..") + image_path;
    await writeFile(folder, req.files[0].buffer);

    let image_path2 = "";
    if (req.files?.[1]) {
      const fileName = uniqueName(req.files[1].originalname);
      image_path2 = `/images/activity/${fileName}`;
      const folder = path.resolve(__dirname, "..") + image_path2;
      await writeFile(folder, req.files[1].buffer);
    }
    const sql = `
    SELECT star
    FROM activitytype
    WHERE TRIM(category) LIKE ? AND TRIM(subtype) LIKE ? AND TRIM(type) LIKE ?
  `;

    const [rows] = await db
      .promise()
      .query(sql, [
        `%${activityCategory.trim()}%`,
        `%${activitySubType.trim()}%`,
        `%${activityType.trim()}%`,
      ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Activity star type not found" });
    }

    const activityStars = rows[0]?.star;

    // let activityStars = star * (placeholder || 1);

    // // custom change in activity points for lions bangalore
    // if (
    //   process.env.DOMAIN_URL.includes("lionsdistrict317f.org") ||
    //   process.env.DOMAIN_URL.includes("lions317f.org")
    // ) {
    //   activityStars = 1;
    // }

    await db
      .promise()
      .query(
        "UPDATE clubs SET activitystar = activitystar + ? WHERE clubId = ?;",
        [activityStars, clubId]
      );
    const result = await db.promise().query("INSERT INTO activities SET ?", {
      amount,
      activityTitle,
      city,
      date,
      cabinetOfficers,
      description,
      lionHours,
      mediaCoverage,
      activityType,
      activitySubType,
      activityCategory,
      place,
      placeholder,
      clubId,
      activityStars,
      image_path,
      image_path2,
    });

    const activityId = result[0]?.insertId;

    return res.status(200).json({
      successMessage: `Activity submitted,You earned ${activityStars} point!! Activity Id is ${activityId}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getActivityStats = async (req, res) => {
  try {
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM activities) AS totalActivities, 
        (SELECT SUM(amount) FROM activities) AS totalAmountSpend, 
        (SELECT SUM(placeholder) FROM activities) AS beneficiariesServed, 
        (SELECT COUNT(DISTINCT clubId) FROM clubs) AS totalClubs, 
        (SELECT SUM(amount) FROM expenses WHERE type = 'deposite') AS amountRaised
    `;
    const [[data]] = await db.promise().query(sql);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to fetch activity Stats" });
  }
};
export const events = async (req, res) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const offset = (page - 1) * limit;

    const upcomingSql = `
    SELECT a.activityId, a.activityTitle, a.date, a.description, a.image_path, a.image_path2, a.clubId, a.place, a.activityCategory, a.activityType, a.cabinetOfficers, c.clubName
    FROM activities a
    JOIN clubs c ON a.clubId = c.clubId
    WHERE a.date >= CURRENT_DATE() 
    ORDER BY a.date ASC 
    LIMIT ${limit} OFFSET ${offset}
  `;

    const pastSql = `
  SELECT a.activityId, a.activityTitle, a.date, a.description, a.image_path, a.image_path2, a.clubId, a.place, a.activityCategory, a.activityType, a.cabinetOfficers, c.clubName
  FROM activities a
  JOIN clubs c ON a.clubId = c.clubId
  WHERE a.date < CURRENT_DATE() 
  ORDER BY a.date DESC 
  LIMIT ${limit} OFFSET ${offset}
`;

    const [upcomingData] = await db.promise().query(upcomingSql);
    const [pastData] = await db.promise().query(pastSql);

    // Get the count of past events and upcoming events
    const pastCountSql = `
      SELECT COUNT(*) AS pastCount
      FROM activities 
      WHERE date < CURRENT_DATE()
    `;
    const [pastCountData] = await db.promise().query(pastCountSql);
    const pastCount = pastCountData[0].pastCount;

    const upcomingCountSql = `
      SELECT COUNT(*) AS upcomingCount
      FROM activities 
      WHERE date >= CURRENT_DATE()
    `;
    const [upcomingCountData] = await db.promise().query(upcomingCountSql);
    const upcomingCount = upcomingCountData[0].upcomingCount;

    const totalCount = pastCount > upcomingCount ? pastCount : upcomingCount;
    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      upcoming: upcomingData,
      past: pastData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: totalPages,
        totalCount: totalCount,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to fetch events" });
  }
};

export const registerActivity = async (req, res) => {
  const { memberId, name, contact, activityId } = req.body;

  const FullName = name;

  try {
    if (memberId) {
      const sql2 = "SELECT * FROM users where id=?";
      const [rows] = await db.promise().query(sql2, memberId);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Invalid Member Id" });
      }
    }
    const sql =
      "INSERT INTO register (memberId,FullName,contact,activityId) VALUES (?, ?, ?, ?)";
    await db.promise().query(sql, [memberId, FullName, contact, activityId]);
    return res.status(200).json({
      successMessage: "Registered successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const regionActivities = async (req, res) => {
  const regionName = req.regionName;

  try {
    const sql = "SELECT DISTINCT clubId from users where regionName = ?";
    const [clubsData] = await db.promise().query(sql, [regionName]);
    const clubIds = clubsData.map((row) => row.clubId);

    const sql2 = `SELECT * from activities where clubId IN (${clubIds.join(
      ","
    )})`;
    const [activitiesData] = await db.promise().query(sql2);

    return res
      .status(200)
      .json({ activitiesData, successMessage: "Region Activities Downloaded" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const zoneActivities = async (req, res) => {
  const regionName = req.regionName;
  const zoneName = req.zoneName;
  try {
    const sql =
      "SELECT DISTINCT clubId from users where regionName = ? and zoneName = ?";
    const [clubsData] = await db.promise().query(sql, [regionName, zoneName]);
    const clubIds = clubsData.map((row) => row.clubId);

    const sql2 = `SELECT * from activities where clubId IN (${clubIds.join(
      ","
    )})`;
    const [activitiesData] = await db.promise().query(sql2);

    return res
      .status(200)
      .json({ activitiesData, successMessage: "Zone Activities Downloaded" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
