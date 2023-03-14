import express from "express";
import {getActivity,getSubtype,getCategory, addActivity, getPlaceholder} from "../controllers/activity.js";
const  router=express.Router();

router.get('/type',getActivity);
router.get('/subtype',getSubtype);
router.get('/category',getCategory);
router.get('/placeholder',getPlaceholder);
router.post('/addactivity',addActivity);

export default router;