import connection from "../config/dbconnection.js";
import { calculatePoints } from "../utils/calculatePoints.js";
const db = await connection();

export const getReports = async (req, res) => {
  // const { month } = req.query;
  // temporary change
  const month=7;
  try {
    const sql = "SELECT * FROM adminreports WHERE month=?";
    const data = await db.promise().query(sql, [month]);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPoints = async (req, res) => {
  const clubId = req.clubId;
  try {
    const sql = "SELECT adminstars, activityStar FROM clubs WHERE clubId=?";
    const [rows] = await db.promise().query(sql, [clubId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }

    const sql2="SELECT COUNT(*) as newsCount FROM news WHERE clubId = ?";
    const [[{newsCount}]] = await db.promise().query(sql2,[clubId]);
    return res.status(200).json({
      adminstars: rows[0].adminstars,
      activityStar: rows[0].activityStar,
      newsCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addReport = async (req, res) => {
  const clubId = req.clubId;
  const data = req.body;
  const month = data[0].month;

  try {
    const adminstars = calculatePoints(data);

    // const [rows] = await db
    //   .promise()
    //   .query(`SELECT month${month} FROM clubs WHERE clubId = ?;`, [clubId]);
    // if (rows[0][`month${month}`]) {
    //   return res
    //     .status(400)
    //     .json({ message: `Month ${month} reporting allready done` });
    // }
    // await db
    //   .promise()
    //   .query("UPDATE clubs SET adminstars = adminstars + ? WHERE clubId = ?;", [
    //     adminstars,
    //     clubId,
    //   ]);
    // await db
    //   .promise()
    //   .query(`UPDATE clubs SET month${month} = ?  WHERE clubId = ?;`, [
    //     1,
    //     clubId,
    //   ]);
    data.forEach(async (element) => {
      const { id, month, title, adminstars, count } = element;
      try {
        await db
          .promise()
          .query(
            "INSERT INTO reporting (titleId, month, title, adminstars, count,clubId, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [id, month, title, adminstars, parseInt(count), clubId, "pending"]
          );
      } catch (error) {
        console.error(error);
        throw new Error("Failed to insert report data");
      }
    });

    return res.status(200).json({
      successMessage: `Reported Successfully,You will earn ${adminstars} Point once approved`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const topClubsByAdmin = async (req, res) => {

  try {
    const sql = "SELECT clubName, adminstars FROM clubs ORDER BY adminstars DESC LIMIT 16";
    const [topClubs] = await db.promise().query(sql);
    if (topClubs.length === 0) {
      return res.status(404).json({ message: "Clubs not found" });
    }

    return res.status(200).json( topClubs );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

