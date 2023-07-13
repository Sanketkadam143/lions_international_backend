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
  const { clubId, clubName, adminstars, lastupdated } = req.body;
  
  try {
    const sql = "SELECT clubId, clubName, adminstars,lastupdated FROM clubs";
    const params = [clubId, clubName, adminstars, lastupdated];
    const [rows] = await db.promise().query(sql, params);

    return res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const deleteClub = async (req, res) => {
  const { clubId } = req.body; 

  try {
    const sql = "DELETE FROM clubs WHERE clubId = ?";

    await db.promise().query(sql, [clubId]); 
    return res.status(200).json({ message: "Club deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
