import connection from "../config/dbconnection.js";
const db = await connection();


export const zone = async (req, res) => {
 const zoneName=req.zoneName;
 const regionName=req.regionName;
  try {
    const sql = "SELECT distinct  clubName,clubId,regionName,zoneName FROM users WHERE zoneName=? and regionName=?";
    const [data] = await db.promise().query(sql,[zoneName,regionName]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const region = async (req, res) => {
    const regionName=req.regionName;
     try {
       const sql = "SELECT distinct clubName,clubId,regionName,zoneName FROM users WHERE regionName=?";
       const [data] = await db.promise().query(sql,[regionName]);
       return res.status(200).json(data);
     } catch (error) {
       console.log(error);
       return res.status(500).json({ message: "Something went wrong" });
     }
   };