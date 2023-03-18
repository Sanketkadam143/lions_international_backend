import connection from "../config/dbconnection.js";
const db = connection();

export const addNews = async (req, res) => {
  const { newsTitle, description, newsPaperLink, authorId,clubId } = req.body;

  try {
    await db.promise().query(
      "INSERT INTO news (newsTitle, description, newsPaperLink, authorId, clubId) VALUES (?, ?, ?, ?, ?)",
      [newsTitle, description, newsPaperLink, authorId, clubId]
    );
    return res.status(200).json({ successMessage: "News submitted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};