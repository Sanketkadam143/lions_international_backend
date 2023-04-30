import express from "express";
import { addGallery, galleryImages, sliderImages } from "../controllers/assets.js";


const  router=express.Router();

router.get('/slider',sliderImages);
router.get('/gallery',galleryImages);
router.post('/addGallery',addGallery);

export default router;