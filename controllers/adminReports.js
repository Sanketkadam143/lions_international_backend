import connection from "../config/dbconnection.js";
import { calculatePoints } from "../utils/calculatePoints.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { uniqueName, writeFile } from "../utils/index.js";
const db = await connection();

const __dirname = path.dirname(
  new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")
);

export const getReports = async (req, res) => {
  const { month } = req.query;
  const clubId = req.clubId;
  try {
    const [rows] = await db
      .promise()
      .query(`SELECT month${month} FROM clubs WHERE clubId = ?;`, [clubId]);

    if (rows[0][`month${month}`]) {
      return res
        .status(400)
        .json({ message: `Month ${month} reporting allready done` });
    }

    const sql = "SELECT * FROM adminreports WHERE month=?";
    const data = await db.promise().query(sql, [month]);
    if (data[0].length === 0) {
      return res.status(404).json({ message: "Reports not found" });
    }
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getPoints = async (req, res) => {
  const clubId = req.clubId;
  try {
    const sql = "SELECT adminstars, activityStar FROM clubs WHERE clubId=?";
    const [rows] = await db.promise().query(sql, [clubId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Club not found" });
    }

    const sql2 = "SELECT COUNT(*) as newsCount FROM news WHERE clubId = ?";
    const [[{ newsCount }]] = await db.promise().query(sql2, [clubId]);
    return res.status(200).json({
      adminstars: rows[0].adminstars,
      activityStar: rows[0].activityStar,
      newsCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const addReport = async (req, res) => {
  const clubId = req.clubId;
  const data = JSON.parse(req.body.data);
  const month = JSON.parse(req.body.month);

  try {
    if (month !== data[0]?.month) {
      return res
        .status(400)
        .json({ message: "Selected month and reporting points dont match" });
    }
    if (!month) {
      return res.status(400).json({ message: "Please select a month" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    let filename = uniqueName(req.file.originalname);

    const filePath = path.resolve(
      __dirname,
      "..",
      "images/adminReports",
      filename
    );
    await writeFile(filePath, req.file.buffer);

    const pathToSave = `/images/adminReports/${filename}`;
    const adminstars = calculatePoints(data);

    const [rows] = await db
      .promise()
      .query(`SELECT month${month} FROM clubs WHERE clubId = ?;`, [clubId]);
    if (rows[0][`month${month}`]) {
      return res
        .status(400)
        .json({ message: `Month ${month} reporting allready done` });
    }

    const insertPromises = data.map(async (element) => {
      const { id, month, title, adminstars, count, srNo } = element;
      try {
        await db
          .promise()
          .query(
            "INSERT INTO reporting (titleId, month, title, adminstars, count,clubId, status,pdfPath) VALUES (?, ?, ?, ?, ?, ?, ?,?)",
            [
              srNo,
              month,
              title,
              adminstars,
              parseInt(count),
              clubId,
              "pending",
              pathToSave,
            ]
          );
      } catch (error) {
        console.error(error);
        throw new Error("Something went wrong");
      }
    });

    await Promise.all(insertPromises);
    await db
      .promise()
      .query(
        `UPDATE clubs SET adminstars = adminstars + ?,month${month} = ? WHERE clubId = ?;`,
        [adminstars, adminstars, clubId]
      );

    return res.status(200).json({
      successMessage: `Reported Successfully,You will earn ${adminstars} Point once approved`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message:error.message });
  }
};

export const topClubsByAdmin = async (req, res) => {
  try {
    const sql =
      "SELECT clubName, adminstars FROM clubs ORDER BY adminstars DESC LIMIT 16";
    const [topClubs] = await db.promise().query(sql);
    if (topClubs.length === 0) {
      return res.status(404).json({ message: "Clubs not found" });
    }

    return res.status(200).json(topClubs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const allClubsReporting = async (req, res) => {
  try {
    const { clubId } = req.query;
    if (!clubId) {
      return res.status(400).json({ message: "clubId not provided" });
    }
    const sql = "SELECT * from clubs WHERE clubId=?";
    const [clubsreporting] = await db.promise().query(sql, [clubId]);

    return res.status(200).json(clubsreporting);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
