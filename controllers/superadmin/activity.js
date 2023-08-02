import connection from "../../config/dbconnection.js";
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

export const AddActivity = async (req, res) => {
  const {
    activityType,
    activitySubType,
    activityCategory,
    placeHolderValue,
    beneficiaries,
    star,
  } = req.body;
  const type = activityType;
  const subtype = activitySubType;
  const category = activityCategory;
  const placeholder = placeHolderValue;

  try {
    const sql =
      "Insert into activitytype (type,subtype,category,placeholder,beneficiaries,star)VALUES (?,?,?,?,?,?)";
    await db
      .promise()
      .query(sql, [type, subtype, category, placeholder, beneficiaries, star]);

    return res
      .status(200)
      .json({ successMessage: `activity added successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const stats = async (req, res) => {
  try {
    const [result] = await db.promise().query(`
      SELECT
        (SELECT COUNT(*) FROM activities) AS totalActivities,
        (SELECT COUNT(*) FROM clubs) AS totalClubs,
        (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE type IN ('withdraw', 'expense')) AS totalExpenses,
        (SELECT COALESCE(SUM(placeholder), 0) FROM activities) AS beneficiaryServed,
        (SELECT COALESCE(SUM(lionHours), 0) FROM activities) AS totalLionHours,
        (SELECT COUNT(*) FROM users) AS totalMembers;
    `);

    return res.status(200).json({
      totalActivities: result[0].totalActivities,
      totalClubs: result[0].totalClubs,
      totalExpenses: -result[0].totalExpenses,
      beneficiaryServed: result[0].beneficiaryServed,
      totalLionHours: result[0].totalLionHours,
      totalMembers: result[0].totalMembers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const upComingActivity = async (req, res) => {
  try {
    const sql = `SELECT activityTitle,description, place, date
    FROM activities
    WHERE date >= CURDATE() ORDER BY date ASC;`;

    const [rows] = await db.promise().query(sql);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const allActivities = async (req, res) => {
  const { type, subtype, category, placeholder } = req.body;
  try {
    const sql = `SELECT type,subtype,category,placeholder
    FROM activitytype`;
    const params = [type, subtype, category, placeholder];
    const [rows] = await db.promise().query(sql, params);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
