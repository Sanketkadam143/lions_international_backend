import express from "express";
import { sliderImages } from "../controllers/assets.js";


const  router=express.Router();

router.get('/slider',sliderImages);



export default router;