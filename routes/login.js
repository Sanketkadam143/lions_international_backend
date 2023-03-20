import express from "express";
import { signIn,resetPassword} from "../controllers/login.js";
import auth from '../middleware/auth.js';

const  router=express.Router();

router.post('/login',signIn);
router.post('/resetpass',auth,resetPassword);


export default router;