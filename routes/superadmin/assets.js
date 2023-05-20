import express from "express";
import { addGallery } from "../../controllers/assets.js";
import superAuth from "../../middleware/superAdmin.js";
import upload from "../../middleware/imageMulter.js";
const  router=express.Router();

router.post('/addGallery',superAuth,upload.single("image"),addGallery);

export default router;