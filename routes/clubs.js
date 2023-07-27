import express from "express";
import { zone,region,allClubs,userTitles,downloadMemberData,getDistrictData,regionActivities } from "../controllers/clubs.js";
import auth from '../middleware/auth.js';


const  router=express.Router();

router.get('/zone',auth,zone);
router.get('/region',auth,region);
router.get('/region/allactivities',auth,regionActivities);
router.get('/allclubs',auth,allClubs);
router.get('/titles',auth,userTitles);
router.post('/download-member-data',auth,downloadMemberData);
router.get('/districtdata',getDistrictData)


export default router;