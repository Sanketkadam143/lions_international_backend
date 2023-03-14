import express from "express";
import { getReports,getPoints,report} from "../controllers/adminReports.js";
import auth from '../middleware/auth.js';

const  router=express.Router();

router.get('/getreports',getReports);
router.get('/points',auth,getPoints)
router.post('/report',auth,report)


export default router;