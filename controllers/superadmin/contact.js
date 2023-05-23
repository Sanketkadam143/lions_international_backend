import connection from "../../config/dbconnection.js";
const db = await connection();
export const getContact = async (req, res) => {
    const {id,query, name,number,email,message } = req.body;
  
    try {
      const sql = "SELECT id,query, name,number,email,message FROM contact";
      const params = [id,query, name,number,email,message ];
      const [rows] = await db.promise().query(sql, params);
  
      return res.status(200).json(rows);
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong" });
    }
  };