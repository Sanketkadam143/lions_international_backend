import express from "express";
import { updateProfile, memberProfile} from "../controllers/member.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/imageMulter.js";

const  router=express.Router();

router.post('/updateprofile',auth,upload.single("profilePicture"),updateProfile);
router.get('/profile',auth,memberProfile);

export default router;