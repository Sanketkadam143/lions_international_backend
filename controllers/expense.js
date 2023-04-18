import connection from "../config/dbconnection.js";
const db = await connection();

export const expenses = async (req, res) => {
  const clubId = req.clubId;
  const authorId = req.userId;
  const { date, amount, purpose, paymentMode, type } = req.body;

  try {
    const sql =
      "INSERT INTO expenses (date, amount, purpose, paymentMode, type, clubId, authorId) VALUES (?, ?, ?, ?, ?, ?, ?)";
    await db
      .promise()
      .query(sql, [date, amount, purpose, paymentMode, type, clubId, authorId]);

    return res
      .status(200)
      .json({ successMessage: `${type} added successfully` });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const clubStatement = async (req, res) => {
  const clubId = req.clubId;
  try {
    const sql = "SELECT * FROM expenses WHERE clubId=?";
    const [data] = await db.promise().query(sql, [clubId]);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
