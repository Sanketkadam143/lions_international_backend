import express from "express";
import {getActivity,getSubtype,getCategory, addActivity} from "../controllers/activity.js";
const  router=express.Router();

router.get('/type',getActivity);
router.get('/subtype',getSubtype);
router.get('/category',getCategory);

router.post('/addactivity',addActivity);

export default router;