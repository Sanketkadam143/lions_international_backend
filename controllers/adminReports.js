import connection from "../config/dbconnection.js";
import { calculatePoints } from "../utils/calculatePoints.js";
const db = connection();

export const getReports = async (req, res) => {
  const { month } = req.query;
  try {
    const sql = "SELECT * FROM reports WHERE month=?";
    const data = await db.promise().query(sql,[month]);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPoints = async (req, res) => {
    const clubId = req.clubId;
    try {
      const sql = "SELECT stars, activityStar FROM clubs WHERE clubId=?";
      const [rows] = await db.promise().query(sql, [clubId]);
      if (rows.length === 0) {
        return res.status(404).json({ message: "Club not found" });
      }
      return res.status(200).json({ star: rows[0].stars, activityStar: rows[0].activityStar });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  export const report = async (req, res) => {
    const clubId = req.clubId;
    const data = req.body;
    try {
      const points=calculatePoints(data);
      return res.status(200).json({points});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
