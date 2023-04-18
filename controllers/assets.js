import connection from "../config/dbconnection.js";
const db = await connection();

export const sliderImages = async (req, res) => {
 
  try {
    const sql = "SELECT * FROM slider";
    const data = await db.promise().query(sql);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};