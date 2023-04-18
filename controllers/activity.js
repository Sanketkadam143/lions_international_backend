import connection from "../config/dbconnection.js";
import sharp from "sharp";
import path from "path";
const db = await connection();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

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
    const sql = `SELECT DISTINCT subtype FROM activitytype WHERE type = ?`;
    const [data] = await db.promise().query(sql, [type]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { subtype } = req.query;
    const sql = `SELECT DISTINCT category FROM activitytype WHERE subtype = ?`;
    const [data] = await db.promise().query(sql, [subtype]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPlaceholder = async (req, res) => {
  try {
    const { category } = req.query;
    const sql = `SELECT DISTINCT placeholder FROM activitytype WHERE category = ?`;
    const [data] = await db.promise().query(sql, [category]);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getReportedActivity = async (req, res) => {
  const clubId = req.clubId;
  try {
    const sql = `SELECT * FROM activities WHERE clubId=?`;
    const [data] = await db.promise().query(sql, [clubId]);
    return res.status(200).json(data);
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
    placeHolderValue,
  } = req.body;

  const clubId = req.clubId;
  try {
    const image_path = `/images/activity/${req.file.originalname}`;
    const folder = path.resolve(__dirname, "..") + image_path;
    await sharp(req.file.buffer).png().toFile(folder);

    const [rows] = await db
      .promise()
      .query("SELECT star FROM activitytype WHERE category=?", [
        activityCategory,
      ]);
    const star = rows[0].star;
    const activityStars = star * (placeHolderValue || 1);
    const placeHolder = placeHolderValue;
    await db
      .promise()
      .query(
        "UPDATE clubs SET activitystar = activitystar + ? WHERE clubId = ?;",
        [activityStars, clubId]
      );
    await db.promise().query("INSERT INTO activities SET ?", {
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
      placeHolder,
      clubId,
      activityStars,
      image_path,
    });

    return res.status(200).json({
      successMessage: `Activity submitted,You earned ${activityStars} stars !!`,
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
        (SELECT COUNT(DISTINCT clubId) FROM users) AS totalClubs, 
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
    const upcomingSql = `
      SELECT activityId,activityTitle,date,description,image_path,clubId FROM activities 
      WHERE date >= CURRENT_DATE() 
      ORDER BY date ASC 
      LIMIT 5
    `;
    const pastSql = `
      SELECT activityId,activityTitle,date,description,image_path,clubId FROM activities 
      WHERE date < CURRENT_DATE() 
      ORDER BY date DESC 
      LIMIT 5
    `;
    const [upcomingData] = await db.promise().query(upcomingSql);
    const [pastData] = await db.promise().query(pastSql);
    return res.status(200).json({ upcoming: upcomingData, past: pastData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to fetch events" });
  }
};

