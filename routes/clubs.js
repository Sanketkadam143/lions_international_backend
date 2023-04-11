import express from "express";
import { zone,region } from "../controllers/clubs.js";
import auth from '../middleware/auth.js';


const  router=express.Router();

router.get('/zone',auth,zone);
router.get('/region',auth,region);


export default router;