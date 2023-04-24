import express from "express";
import { stats } from "../../controllers/superadmin/activity.js";
import superAuth from "../../middleware/superAdmin.js";
const  router=express.Router();

router.get('/stats',superAuth,stats);



export default router;