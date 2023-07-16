import express from "express";
import { getReports,getPoints,addReport,topClubsByAdmin,allClubsReporting} from "../controllers/adminReports.js";
import auth from '../middleware/auth.js';

const  router=express.Router();

router.get('/reports',auth,getReports);
router.get('/points',auth,getPoints);
router.post('/addreport',auth,addReport);
router.get('/topclubs',topClubsByAdmin);
router.get('/clubsreporting',auth,allClubsReporting);


export default router;