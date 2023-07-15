import express from "express";
import { getReports,getPoints,addReport,topClubsByAdmin} from "../controllers/adminReports.js";
import auth from '../middleware/auth.js';

const  router=express.Router();

router.get('/reports',auth,getReports);
router.get('/points',auth,getPoints);
router.post('/addreport',auth,addReport);
router.get('/topclubs',topClubsByAdmin);


export default router;