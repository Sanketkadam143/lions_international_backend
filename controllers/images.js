import path from "path";
import fs from "fs";

const __dirname = path.dirname(new URL(import.meta.url).pathname).replace(/^\/(\w:)/, '$1');

export const getImages = async (req, res) => {
  try {
    const { folder, filename } = req.params;
    const imagePath = path.join(__dirname, '..', 'images', folder, filename);
    if (!fs.existsSync(imagePath)) {
      throw new Error();
    }
    return res.sendFile(imagePath);
  } catch (error) {

    return res.status(404).json("Image not found");
  }
};
