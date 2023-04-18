import express from "express";
import {getActivity,getSubtype,getCategory, addActivity, getPlaceholder,getReportedActivity,getActivityStats,events} from "../controllers/activity.js";
import auth from '../middleware/auth.js';
import upload from "../middleware/imageMulter.js";

const  router=express.Router();

router.get('/type',getActivity);
router.get('/subtype',getSubtype);
router.get('/category',getCategory);
router.get('/placeholder',getPlaceholder);
router.get('/stats',getActivityStats);
router.get('/events',events);
router.get('/reportedactivity',auth,getReportedActivity);
router.post('/addactivity',auth,upload.single("image"),addActivity);

export default router;