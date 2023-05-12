import connection from "../config/dbconnection.js";
const db = await connection();

export const download = async (req, res) => {
    const clubId = req.clubId;
    try {
      const sql = "SELECT * FROM news WHERE clubId=? ";
      const data = await db.promise().query(sql, [clubId]);
  
      return res.status(200).json(data[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

