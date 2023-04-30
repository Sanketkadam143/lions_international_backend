import express from "express";
import { adminSignIn } from "../../controllers/superadmin/login.js";

const  router=express.Router();

router.post('/login',adminSignIn);



export default router;