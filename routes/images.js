import express from "express";
import { getImages,VistorCounter } from "../controllers/images.js";

const  router=express.Router();

router.get('/:folder/:filename',getImages);
router.get('/counter', VistorCounter)
  
  

export default router;
