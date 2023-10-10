import connection from "../../config/dbconnection.js";
const db = await connection();

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
  