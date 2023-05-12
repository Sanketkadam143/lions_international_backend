import express from "express";
import { clubs } from "../../controllers/superadmin/clubs.js";
// import superAuth from "../../middleware/superAdmin.js";
const  router=express.Router();

router.post('/clubs',clubs);



export default router;