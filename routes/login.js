import express from "express";
import { signIn,resetPassword,forgotPassword} from "../controllers/login.js";
import auth from '../middleware/auth.js';

const  router=express.Router();

router.post('/login',signIn);
router.post('/resetpass',auth,resetPassword);
router.post('/forgotpass',forgotPassword);


export default router;