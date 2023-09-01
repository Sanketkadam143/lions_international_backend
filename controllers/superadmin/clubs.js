import connection from "../../config/dbconnection.js";
const db = await connection();

export const addClub = async (req, res) => {
  const { clubName, clubId, regionName, zoneName } = req.body;

  try {
    if (!clubName || !clubId || !regionName || !zoneName) {
      return res.status(400).json({
        message: "Please fill all the fields",
      });
    }

    // Check if the clubId already exists in the database
    const checkSql = "SELECT clubId FROM clubs WHERE clubId = ?";
    const [rows] = await db.promise().query(checkSql, [clubId]);

    if (rows.length > 0) {
      return res.status(400).json({
        message: "Club ID already exists",
      });
    }

    const sql =
      "INSERT INTO clubs (clubName, clubId, regionName, zoneName) VALUES (?, ?, ?, ?)";
    await db.promise().query(sql, [clubName.toUpperCase(), clubId, regionName, zoneName]);

    return res.status(200).json({
      successMessage: "Club added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


export const getClub = async (req, res) => {
  try {
    const sql =
      "SELECT clubId, clubName, adminstars, lastupdated FROM clubs ORDER BY clubName";
    const [rows] = await db.promise().query(sql);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const downloadClubRanking = async (req, res) => {
  try {
    const sql =
    "SELECT clubId, clubName, adminstars, activityStar FROM clubs ORDER BY adminstars DESC";
    const [rows] = await db.promise().query(sql);
    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getClubActivities = async (req, res) => {
  const { clubId } = req.query;

  try {
    const sql = `SELECT * FROM activities WHERE clubId=?`;
    const [activities] = await db.promise().query(sql, [clubId]);

    // for (const activity of activities) {
    //   const registerSql = `SELECT * FROM register WHERE activityId=?`;
    //   const [registrations] = await db.promise().query(registerSql, [activity.activityId]);
    //   activity.registrations = registrations;
    // }

    return res.status(200).json(activities);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getClubnews = async (req, res) => {
  const { clubId } = req.query;
  try {
    const sql = "SELECT * FROM news WHERE clubId=?";
    const data = await db.promise().query(sql, [clubId]);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getClubAdminReport = async (req, res) => {
  const { clubId, month } = req.query;
  try {
    if (!month || !clubId) {
      return res
        .status(404)
        .json({ message: "Please provide month and clubId" });
    }
    const sql = `SELECT month${month}, activityStar, adminstars,clubName FROM clubs WHERE clubId=? ORDER BY clubName`;
    const [data] = await db.promise().query(sql, [clubId]);
    if (data[0][`month${month}`] === 0) {
      return res
        .status(404)
        .json({ message: "Reporting not done for current month" });
    }
    const sql2 = `SELECT * FROM reporting WHERE clubId=? AND month=?`;
    const [reports] = await db.promise().query(sql2, [clubId, month]);
    if (reports.length === 0) {
      return res.status(404).json({ message: "Reports not found" });
    }
    const pdfPath = reports[0].pdfPath;
    return res.status(200).json({
      activityStar: data[0].activityStar,
      adminstars: data[0][`month${month}`],
      clubName: data[0].clubName,
      pdfPath: pdfPath,
      reports: reports,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllAdminReport = async (req, res) => {
  const { month } = req.query;
  try {
    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }
    const sql = `SELECT month${month} AS adminstars, activityStar, clubName,clubId FROM clubs ORDER BY clubName `;
    const [data] = await db.promise().query(sql);
    const reportedClubs = [];
    const nonReportedClubs = [];

    data.forEach((club) => {
      if (club.adminstars === 0) {
        nonReportedClubs.push(club);
      } else {
        reportedClubs.push(club);
      }
    });
    return res.status(200).json({
      reportedClubs,
      nonReportedClubs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteClub = async (req, res) => {
  const { clubId } = req.query;

  try {
    return res.status(400).json({
      message:
        "This action is risky,it will delete all club information, can only be done by system owner",
    });

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
      SELECT adminstars FROM clubs WHERE clubId = ?;
    `;
    const activityCountQuery = `
      SELECT COUNT(*) AS activityCount FROM activities WHERE clubId = ?;
    `;
    const totalExpenseQuery = `
      SELECT SUM(amount) AS totalExpense FROM activities WHERE clubId = ?;
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
    const activityCountResult = await db
      .promise()
      .query(activityCountQuery, [clubId]);
    const totalExpenseResult = await db
      .promise()
      .query(totalExpenseQuery, [clubId]);
    const clubInfoResult = await db.promise().query(clubInfoQuery, [clubId]);
    const totalMembersResult = await db
      .promise()
      .query(totalMembersQuery, [clubId]);
    const totalNewsResult = await db.promise().query(totalNewsQuery, [clubId]);

    const adminPoint = countResult[0][0].adminstars;
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
