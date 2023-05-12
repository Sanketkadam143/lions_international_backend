import connection from "../../config/dbconnection.js";
const db = await connection();

export const clubs = async (req, res) => {
    const { clubName,clubId } = req.body;

    try {
  
      const sql =
          "INSERT INTO clubs (clubName,clubId) VALUES (?, ?)";
        await db.promise().query(sql, [clubName,clubId]);
        return res.status(200).json({
          successMessage: "Registered successfully",
        });
    } 
    catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  };