import express from "express";
import {getActivity,getSubtype,getCategory, registerActivity,addActivity, getClubDirector,getPlaceholder,getReportedActivity,getActivityStats,events,deleteActivity,regionActivities,zoneActivities,editActivity} from "../controllers/activity.js";
import auth from '../middleware/auth.js';
import upload from "../middleware/imageMulter.js";

const  router=express.Router();

router.get('/type',getActivity);
router.get('/subtype',getSubtype);
router.get('/category',getCategory);
router.get('/placeholder',getPlaceholder);
router.get('/stats',getActivityStats);
router.get('/events',events);
router.get('/clubdirectors',auth,getClubDirector);
router.get('/reportedactivity',auth,getReportedActivity);
router.delete('/deleteactivity',auth,deleteActivity);
router.post('/addactivity',auth,upload.array("image",2),addActivity);
router.post('/update',auth,upload.array("image",2),editActivity);
router.post('/register',registerActivity);
router.get('/region/allactivities',auth,regionActivities);
router.get('/zone/allactivities',auth,zoneActivities);

export default router;