import express from "express";
import { getImages } from "../controllers/images.js";

const  router=express.Router();

router.get('/:folder/:filename',getImages);
  
  

export default router;
