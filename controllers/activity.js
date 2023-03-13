import connection from "../config/dbconnection.js";
const db = connection();

export const getActivity = async (req, res) => {
  try {
    const sql = "SELECT distinct activityType FROM activities";
    const data = await db.promise().query(sql);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getSubtype = async (req, res) => {
  try {
    const { activityType } = req.query; 
    const sql = `SELECT DISTINCT activitySubType FROM activities WHERE activityType = ?`;
    const [data] = await 
    db.promise().query(sql, [activityType]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getCategory = async (req, res) => {
  try {
    const { activitySubType } = req.query;
    const sql = `SELECT DISTINCT activityCategory FROM activities WHERE activitySubType = ?`;
    const [data] = await db.promise().query(sql, [activitySubType]);
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
    peopleServed,
    activityType,
    activitySubType,
    activityCategory,
    place,
    authorId,
    clubId
  } = req.body;
  try {
    await db.promise().query(
      "INSERT INTO activities SET ?",
      {
        amount,
        activityTitle,
        city,
        date,
        cabinetOfficers,
        description,
        lionHours,
        mediaCoverage,
        peopleServed,
        activityType,
        activitySubType,
        activityCategory,
        place,authorId,
        clubId
      }
    );
   
    return res.status(200).json({ successMessage: "Activity submitted" });
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};