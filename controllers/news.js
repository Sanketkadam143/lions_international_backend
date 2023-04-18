import connection from "../config/dbconnection.js";
import sharp from "sharp";
import path from "path";
const db = await connection();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const reportedNews = async (req, res) => {
  const clubId = req.clubId;
  try {
    const sql = "SELECT * FROM news WHERE clubId=?";
    const data = await db.promise().query(sql, [clubId]);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const newsReporting = async (req, res) => {
  const clubId = req.clubId;
  const authorId = req.userId;
  const verified = 0;
  const { newsTitle, newsPaperLink, date, description, image } = req.body;
  try {
    const imagePath = `/images/news/${req.file.originalname}`;
    const folder = path.resolve(__dirname, "..") + imagePath;
    await sharp(req.file.buffer).png().toFile(folder);

    const sql =
      "INSERT INTO news (clubId, authorId, verified, newsTitle, newsPaperLink, date, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    await db
      .promise()
      .query(sql, [
        clubId,
        authorId,
        verified,
        newsTitle,
        newsPaperLink,
        date,
        description,
        imagePath,
      ]);
    return res
      .status(200)
      .json({ successMessage: "News inserted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const topNews = async (req, res) => {
  try {
    const sql = "SELECT * FROM news WHERE verified=1 ORDER BY date DESC LIMIT 10";
    const data = await db.promise().query(sql);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

