import express from "express";
import { addUser, Profiles} from "../controllers/user.js";

const  router=express.Router();

router.post('/adduser',addUser);
router.get('/profile',Profiles);

export default router;