import express from "express";
import { addGallery ,addSlider,galleryImages, sliderImages,deleteSlider,deleteGallery,addDistrictResources,getDistrictResources,deleteDistrictResources,addInternationalResources,getInternationalResources,deleteInternationalResources} from "../../controllers/assets.js";
import superAuth from "../../middleware/superAdmin.js";
import upload from "../../middleware/imageMulter.js";
const  router=express.Router();

router.post('/addgallery',superAuth,upload.single("image"),addGallery);
router.post('/addslider',superAuth,upload.single("image"),addSlider);
router.get('/slider',sliderImages);
router.get('/gallery',galleryImages);
router.delete('/slider/:id',superAuth,deleteSlider);
router.delete('/gallery/:id',superAuth,deleteGallery);
router.post('/add-district-resources',superAuth,upload.single("image"),addDistrictResources);
router.get('/district-resources',getDistrictResources);
router.delete('/district-resources/:id',superAuth,deleteDistrictResources);
router.post('/add-international-resources',superAuth,upload.single("image"),addInternationalResources);
router.get('/international-resources',getInternationalResources);
router.delete('/international-resources/:id',superAuth,deleteInternationalResources);

export default router;