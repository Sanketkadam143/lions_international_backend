import express from "express";
import { AddActivity,allActivities,getActivity, getCategory, getSubtype, stats, upComingActivity,deleteActivityType,downloadAllActivity } from "../../controllers/superadmin/activity.js";
import superAuth from "../../middleware/superAdmin.js";

const  router=express.Router();

router.get('/stats',superAuth,stats);
router.get('/getUpcomingActivity',superAuth,upComingActivity);
router.get('/type',superAuth,getActivity);
router.get('/subtype',superAuth,getSubtype);
router.get('/category',superAuth,getCategory);
router.post('/add-activity-type',superAuth,AddActivity);
router.delete('/delete-activity-type/:id',superAuth,deleteActivityType);
router.get('/activities',superAuth,allActivities)
router.get('/download-activities',superAuth,downloadAllActivity)
export default router;