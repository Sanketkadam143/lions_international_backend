import express from "express";
import { region } from "../../controllers/clubs.js";
import superAuth from "../../middleware/superAdmin.js";
const  router=express.Router();

router.get('/',superAuth,region);



export default router;