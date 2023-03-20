import connection from "../config/dbconnection.js";
const db = await connection();

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
    });

    return res
      .status(200)
      .json({
        successMessage: `Activity submitted,You earned ${activityStars} stars !!`,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
