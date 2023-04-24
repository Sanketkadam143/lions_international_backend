import connection from "../../config/dbconnection.js";
const db = await connection();

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

    return res
      .status(200)
      .json({
        totalActivities: result[0].totalActivities,
        totalClubs: result[0].totalClubs,
        totalExpenses: -result[0].totalExpenses,
        beneficiaryServed: result[0].beneficiaryServed,
        totalLionHours: result[0].totalLionHours,
        totalMembers: result[0].totalMembers
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
