import express from "express";
import { addNews } from "../controllers/news.js";


const  router=express.Router();

router.post('/addNews',addNews);


export default router;