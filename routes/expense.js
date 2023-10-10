import express from "express";
import { expenses,clubStatement} from "../controllers/expense.js";
import auth from '../middleware/auth.js';


const  router=express.Router();


router.post('/',auth,expenses);
router.get('/statement',auth,clubStatement);


export default router;