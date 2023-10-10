import express from "express";
import { zone,region,allClubs,userTitles,downloadMemberData,getDistrictData,clubsData ,clubDetails,addClubAbout,clubList} from "../controllers/clubs.js";
import auth from '../middleware/auth.js';


const  router=express.Router();

router.get('/zone',auth,zone);
router.get('/region',auth,region);
router.get('/allclubs',auth,allClubs);
router.get('/clubs-data',auth,clubsData);
router.get('/club-details',auth,clubDetails);
router.post('/add-club-about',auth,addClubAbout);
router.get('/titles',auth,userTitles);
router.post('/download-member-data',auth,downloadMemberData);
router.get('/districtdata',getDistrictData);
router.get('/list',clubList);


export default router;