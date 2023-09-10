import express from 'express';
import auth from '../../middleware/auth.js';
import superAuth from "../../middleware/superAdmin.js";
import { addClub ,getClub,deleteClub,clubSummary,getClubActivities, getClubnews, getClubAdminReport,downloadClubRanking,getAllAdminReport,editClubInfo,updateClub} from '../../controllers/superadmin/clubs.js';

const router = express.Router();

router.post('/addclubs',superAuth, addClub);
router.get('/getclubs',superAuth,getClub);
router.delete("/deleteclub",superAuth,deleteClub);
router.get('/club-summary',superAuth,clubSummary)
router.get('/clubactivities',superAuth,getClubActivities)
router.get('/clubnews',superAuth,getClubnews)
router.get('/clubadminreport',superAuth,getClubAdminReport)
router.get('/alladminreport',superAuth,getAllAdminReport)
router.get('/download-club-ranking',superAuth,downloadClubRanking)
router.get('/editclubinfo',superAuth,editClubInfo)
router.post('/update',superAuth,updateClub)
export default router;
