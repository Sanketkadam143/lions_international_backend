import express from 'express';
import auth from '../../middleware/auth.js';
import superAuth from "../../middleware/superAdmin.js";
import { addClub ,getClub,deleteClub,clubSummary,getClubActivities, getClubnews} from '../../controllers/superadmin/clubs.js';

const router = express.Router();

router.post('/addclubs',superAuth, addClub);
router.get('/getclubs',superAuth,getClub);
router.delete("/deleteclub",superAuth,deleteClub);
router.get('/club-summary',superAuth,clubSummary)
router.get('/clubactivities',superAuth,getClubActivities)
router.get('/clubnews',superAuth,getClubnews)
export default router;
