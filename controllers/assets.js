import connection from "../config/dbconnection.js";
import sharp from "sharp";
import path from "path";
const db = await connection();

const __dirname = path.dirname(new URL(import.meta.url).pathname);


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
export const galleryImages = async (req, res) => {
 
  try {
   
    const sql = "SELECT * FROM gallery";
    const data = await db.promise().query(sql);
    
    return res.status(200).json(data[0]);
   
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const addGallery = async (req, res) => {
  const clubId = req.clubId;
  const { title, description } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is missing" });
    }

    const imagePath = `/images/gallery/${req.file.originalname}`;
    const folder = path.resolve(__dirname, "..") + imagePath;
    await sharp(req.file.buffer).png().toFile(folder);

    const sql1 = `INSERT INTO gallery(clubId,image,title,description) VALUES(?,?,?,?)`;
    await db.promise().query(sql1, [clubId, imagePath, title, description]);
    return res
      .status(200)
      .json({ successMessage: "Images Added Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
