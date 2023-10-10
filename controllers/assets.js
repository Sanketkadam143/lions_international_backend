import connection from "../config/dbconnection.js";
import path from "path";
import { uniqueName, writeFile } from "../utils/index.js";

const db = await connection();

const __dirname = path.dirname(
  new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")
);

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
  const { title, description } = req.body;
  try {

    if(!req.file || !title || !description){
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const fileName = uniqueName(req.file.originalname);
    const imagePath = `/images/gallery/${fileName}`;
    const folder = path.resolve(__dirname, "..") + imagePath;
    await writeFile(folder, req.file.buffer);

    const sql1 = `INSERT INTO gallery(image,title,description) VALUES(?,?,?)`;
    await db.promise().query(sql1, [imagePath, title, description]);
    return res
      .status(200)
      .json({ successMessage: "Images Added Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const addSlider = async (req, res) => {
  const { title, description } = req.body;
  try {
    if(!req.file || !title || !description){
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const fileName = uniqueName(req.file.originalname);
    const imagePath = `/images/slider/${fileName}`;
    const folder = path.resolve(__dirname, "..") + imagePath;
    await writeFile(folder, req.file.buffer);

    const sql1 = `INSERT INTO slider(image,title,description) VALUES(?,?,?)`;
    await db.promise().query(sql1, [imagePath, title, description]);
    return res
      .status(200)
      .json({ successMessage: "Images Added Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const getResourcesByCategory = async (req, res) => {
  
  try {
    const sql = `SELECT id,title,path,category FROM resources`;
    const data = await db.promise().query(sql);
    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "id param is required" });
    }

    const sql = "DELETE FROM slider WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ successMessage: "Slider Deleted Successfully" });
    } else {
      return res.status(400).json({ message: "Slider Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "id param is required" });
    }

    const sql = "DELETE FROM gallery WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ successMessage: "Gallery Deleted Successfully" });
    } else {
      return res.status(400).json({ message: "Gallery Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const addDistrictResources = async (req, res) => {
  const { title} = req.body;
  const category = "district";
  try {

    if(!req.file || !title ){
      return res.status(400).json({ message: "title and image is mandatory" });
    }

    const fileName = uniqueName(req.file.originalname);
    const imagePath = `/images/resources/${fileName}`;
    const folder = path.resolve(__dirname, "..") + imagePath;
    await writeFile(folder, req.file.buffer);

    const sql1 = `INSERT INTO resources(path,title,category) VALUES(?,?,?)`;
    await db.promise().query(sql1, [imagePath, title, category]);
    return res
      .status(200)
      .json({ successMessage: "District Resource Added Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getDistrictResources = async (req, res) => {
  try {
    const sql = "SELECT * FROM resources WHERE category = 'district'";
    const data = await db.promise().query(sql);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteDistrictResources = async (req, res) => {
  try {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "id param is required" });
    }

    const sql = "DELETE FROM resources WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ successMessage: "District Resources Deleted Successfully" });
    } else {
      return res.status(400).json({ message: "Data Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const addInternationalResources = async (req, res) => {
  const { title} = req.body;
  const category = "international";
  try {

    if(!req.file || !title ){
      return res.status(400).json({ message: "title and image is mandatory" });
    }

    const fileName = uniqueName(req.file.originalname);
    const imagePath = `/images/resources/${fileName}`;
    const folder = path.resolve(__dirname, "..") + imagePath;
    await writeFile(folder, req.file.buffer);

    const sql1 = `INSERT INTO resources(path,title,category) VALUES(?,?,?)`;
    await db.promise().query(sql1, [imagePath, title, category]);
    return res
      .status(200)
      .json({ successMessage: "International Resource Added Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getInternationalResources = async (req, res) => {
  try {
    const sql = "SELECT * FROM resources WHERE category = 'international'";
    const data = await db.promise().query(sql);

    return res.status(200).json(data[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteInternationalResources = async (req, res) => {
  try {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ message: "id param is required" });
    }

    const sql = "DELETE FROM resources WHERE id = ?";
    const [result] = await db.promise().query(sql, [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ successMessage: "International Resources Deleted Successfully" });
    } else {
      return res.status(400).json({ message: "Data Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

