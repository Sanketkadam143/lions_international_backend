import connection from "../../config/dbconnection.js";
const db = await connection();

export const addClub = async (req, res) => {
  const { clubName, clubId } = req.body;

  try {
    const sql = "INSERT INTO clubs (clubName, clubId) VALUES (?, ?)";
    await db.promise().query(sql, [clubName, clubId]);

    return res.status(200).json({
      successMessage: "Club added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errorMessage: "Something went wrong",
    });
  }
};

export const getClub = async (req, res) => {
  try {
    const sql = "SELECT clubId, clubName, adminstars,lastupdated FROM clubs";
    const [rows] = await db.promise().query(sql);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getClubActivities = async (req, res) => {
  const clubId = req.query;
  try {
    const sql = `SELECT * FROM activities WHERE clubId=?`;
    const [activities] = await db.promise().query(sql, [clubId]);
    
    for (const activity of activities) {
      const registerSql = `SELECT * FROM register WHERE activityId=?`;
      const [registrations] = await db.promise().query(registerSql, [activity.activityId]);
      activity.registrations = registrations;
    }

    return res.status(200).json(activities);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getClubnews = async (req, res) => {
  const clubId = req.query;
  try {
    const sql = "SELECT * FROM news WHERE clubId=?";
    const data = await db.promise().query(sql, [clubId]);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteClub = async (req, res) => {
  const { clubId } = req.query;
  console.log(clubId);
  try {
    const sql = "DELETE FROM clubs WHERE clubId = ?";

    await db.promise().query(sql, [clubId]);
    return res
      .status(200)
      .json({ successMessage: "Club deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const clubSummary = async (req, res) => {
  const { clubId } = req.query;

  try {
    const countQuery = `
      SELECT COUNT(*) AS count FROM clubs WHERE clubId = ? AND (month1 = 1 OR month2 = 1 OR month3 = 1 OR month4 = 1 OR month5 = 1 OR month6 = 1 OR month7 = 1 OR month8 = 1 OR month9 = 1 OR month10 = 1 OR month11 = 1 OR month12 = 1);
    `;
    const activityCountQuery = `
      SELECT COUNT(*) AS activityCount FROM activities WHERE clubId = ?;
    `;
    const totalExpenseQuery = `
      SELECT SUM(amount) AS totalExpense FROM expenses WHERE clubId = ? AND type = 'expense';
    `;
    const clubInfoQuery = `
      SELECT clubId, clubName, lastupdated FROM clubs WHERE clubId = ?;
    `;
    const totalMembersQuery = `
      SELECT COUNT(*) AS totalMembers FROM users WHERE clubId = ?;
    `;
    const totalNewsQuery = `
      SELECT COUNT(*) AS totalNews FROM news WHERE clubId = ?;
    `;

    const countResult = await db.promise().query(countQuery, [clubId]);
    const activityCountResult = await db.promise().query(activityCountQuery, [clubId]);
    const totalExpenseResult = await db.promise().query(totalExpenseQuery, [clubId]);
    const clubInfoResult = await db.promise().query(clubInfoQuery, [clubId]);
    const totalMembersResult = await db.promise().query(totalMembersQuery, [clubId]);
    const totalNewsResult = await db.promise().query(totalNewsQuery, [clubId]);

    const adminPoint = countResult[0][0].count;
    const activityCount = activityCountResult[0][0].activityCount;
    const totalExpense = totalExpenseResult[0][0].totalExpense;
    const clubInfo = clubInfoResult[0][0];
    const totalMembers = totalMembersResult[0][0].totalMembers;
    const totalNews = totalNewsResult[0][0].totalNews;

    return res.status(200).json({
      adminPoint,
      activityCount,
      totalExpense,
      ...clubInfo,
      totalMembers,
      totalNews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

