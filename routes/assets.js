import express from "express";
import { galleryImages, sliderImages } from "../controllers/assets.js";


const  router=express.Router();

router.get('/slider',sliderImages);
router.get('/gallery',galleryImages);
export default router;