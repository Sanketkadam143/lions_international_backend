import express from "express";
import { reportedNews,newsReporting} from "../controllers/news.js";
import auth from '../middleware/auth.js';

const  router=express.Router();

router.get('/reportednews',auth,reportedNews);
router.post('/newsreporting',auth,newsReporting);



export default router;