import express from "express";
import {getActivity,getSubtype,getCategory, addActivity, getPlaceholder,getReportedActivity} from "../controllers/activity.js";
import auth from '../middleware/auth.js';
const  router=express.Router();

router.get('/type',getActivity);
router.get('/subtype',getSubtype);
router.get('/category',getCategory);
router.get('/placeholder',getPlaceholder);
router.get('/reportedactivity',auth,getReportedActivity);
router.post('/addactivity',auth,addActivity);

export default router;