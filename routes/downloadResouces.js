import express from "express";
import { download} from "../controllers/downloadResources.js";


const  router=express.Router();

router.get('/download',download);



export default router;