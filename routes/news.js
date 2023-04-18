import express from "express";
import { reportedNews,newsReporting,topNews} from "../controllers/news.js";
import auth from '../middleware/auth.js';
import upload from "../middleware/imageMulter.js";

const  router=express.Router();

router.get('/reportednews',auth,reportedNews);
router.post('/newsreporting',auth,upload.single("image"),newsReporting);
router.get('/topnews',topNews);



export default router;