import express from "express";
import { addUser} from "../controllers/user.js";

const  router=express.Router();

router.post('/adduser',addUser);


export default router;