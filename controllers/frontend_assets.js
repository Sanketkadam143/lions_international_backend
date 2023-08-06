import sharp from "sharp";
import path from "path";
import fs from "fs";
import { uniqueName, writeFile } from "../utils/index.js";

const __dirname = path
  .dirname(new URL(import.meta.url).pathname)
  .replace(/^\/(\w:)/, "$1");

export const getFrontendAssets = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "..", "frontend_assets", filename);
    if (!fs.existsSync(filePath)) {
      throw new Error();
    }
    return res.sendFile(filePath);
  } catch (error) {
    return res.status(404).json("Requested asset not found");
  }
};

export const addFrontendAssets = async (req, res) => {
  try {
    const fileName = uniqueName(req.file.originalname);

    const filePath = path.resolve(__dirname, "..", "frontend_assets", fileName);

    await writeFile(filePath, req.file.buffer);

    const fileUrl = process.env.DOMAIN_URL + "/api/static/assets/" + fileName;
    return res
      .status(200)
      .json({ fileUrl, successMessage: "File added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
