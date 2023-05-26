import express from "express";
import { AddActivity,allActivities,getActivity, getCategory, getSubtype, stats, upComingActivity } from "../../controllers/superadmin/activity.js";
import superAuth from "../../middleware/superAdmin.js";

const  router=express.Router();

router.get('/stats',superAuth,stats);
router.get('/getUpcomingActivity',upComingActivity);
router.get('/type',getActivity);
router.get('/subtype',getSubtype);
router.get('/category',getCategory);
router.post('/addActivity',AddActivity);
router.get('/activities',allActivities)
export default router;