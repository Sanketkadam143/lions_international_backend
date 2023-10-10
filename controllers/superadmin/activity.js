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
  let {
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
  beneficiaries = beneficiaries ? beneficiaries : 0;
  star = star ? star : 1;

  try {
    if (!type || !subtype || !category || !placeholder) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const sql =
      "Insert into activitytype (type,subtype,category,placeholder,beneficiaries,star)VALUES (?,?,?,?,?,?)";
    await db
      .promise()
      .query(sql, [type, subtype, category, placeholder, beneficiaries, star]);

    return res
      .status(200)
      .json({ successMessage: `activity type added successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const stats = async (req, res) => {
  try {
    const sql = `
    SELECT
      (SELECT COUNT(*) FROM activities) AS totalActivities,
      (SELECT COUNT(*) FROM clubs) AS totalClubs,
      (SELECT COALESCE(SUM(amount), 0) FROM activities) AS totalExpenses,
      (SELECT COALESCE(SUM(placeholder), 0) FROM activities) AS beneficiaryServed,
      (SELECT COALESCE(SUM(lionHours), 0) FROM activities) AS totalLionHours,
      (SELECT COUNT(*) FROM users) AS totalMembers;

  `;

    const [result] = await db.promise().query(sql);

    const sql2 = `
    SELECT activityType, COUNT(*) AS typeCount
    FROM activities
    GROUP BY activityType;`;

    const [activityTypeCount] = await db.promise().query(sql2);

    const sql3 = `
    SELECT  activitySubType AS activityType, COUNT(*) AS typeCount
    FROM activities
    GROUP BY  activitySubType;
    `;

    const [activitySubTypeCount] = await db.promise().query(sql3);

    const sql4 = `
    SELECT  activityCategory AS activityType, COUNT(*) AS typeCount
    FROM activities
    GROUP BY  activityCategory;
    `;
    const [activityCategoryCount] = await db.promise().query(sql4);

    return res.status(200).json({
      totalActivities: result[0].totalActivities,
      totalClubs: result[0].totalClubs,
      totalExpenses: result[0].totalExpenses,
      beneficiaryServed: result[0].beneficiaryServed,
      totalLionHours: result[0].totalLionHours,
      totalMembers: result[0].totalMembers,
      activityTypeCount,
      activitySubTypeCount,
      activityCategoryCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const upComingActivity = async (req, res) => {
  try {
    const sql = `
    SELECT a.activityId, a.activityTitle, a.date, a.description, a.image_path, a.image_path2, a.clubId, a.place, a.activityCategory, a.activityType,a.activitySubtype, a.cabinetOfficers, a.amount,a.city,a.lionHours, c.clubName
    FROM activities a
    JOIN clubs c ON a.clubId = c.clubId
    WHERE a.date >= CURRENT_DATE() 
    ORDER BY a.date ASC 
  `;

    const [rows] = await db.promise().query(sql);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const allActivities = async (req, res) => {
  try {
    const sql = `SELECT id,type,subtype,category,placeholder,star
    FROM activitytype`;

    const [rows] = await db.promise().query(sql);
    if (rows.length === 0) {
      return res.status(400).json({ message: "No Activity Type Found" });
    }
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const downloadAllActivity = async (req, res) => {
  try {
    const sql = `
      SELECT
        a.clubId, c.clubName, a.activityId, a.activityTitle, a.city, LEFT(a.date, 10) AS date, a.amount,
        a.cabinetOfficers, a.lionHours, a.place, a.activityCategory, a.activityType,
        a.activitySubType, a.description, a.mediaCoverage, a.placeholder AS beneficiaries
      FROM
        activities a
      INNER JOIN
        clubs c ON a.clubId = c.clubId
    `;

    const [rows] = await db.promise().query(sql);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No activities found" });
    }

    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteActivityType = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "id param is required" });
    }

    const sql = "DELETE FROM  activitytype WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);

    if (result.affectedRows > 0) {
      return res
        .status(200)
        .json({ successMessage: "Activity Type Deleted Successfully" });
    } else {
      return res.status(400).json({ message: "Activity Type Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
