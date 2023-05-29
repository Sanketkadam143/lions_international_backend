import express from "express";
import { galleryImages, sliderImages ,getResourcesByCategory} from "../controllers/assets.js";


const  router=express.Router();

router.get('/slider',sliderImages);
router.get('/gallery',galleryImages);
router.get('/downloadResources',getResourcesByCategory);
export default router;