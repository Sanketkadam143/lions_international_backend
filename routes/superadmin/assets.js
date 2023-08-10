import express from "express";
import { addGallery ,addSlider,galleryImages, sliderImages,deleteSlider,deleteGallery} from "../../controllers/assets.js";
import superAuth from "../../middleware/superAdmin.js";
import upload from "../../middleware/imageMulter.js";
const  router=express.Router();

router.post('/addGallery',superAuth,upload.single("image"),addGallery);
router.post('/addSlider',superAuth,upload.single("image"),addSlider);
router.get('/slider',sliderImages);
router.get('/gallery',galleryImages);
router.delete('/slider/:id',superAuth,deleteSlider);
router.delete('/gallery/:id',superAuth,deleteGallery);
export default router;