import express from "express";
import { getFrontendAssets,addFrontendAssets } from "../controllers/frontend_assets.js";
import upload from "../middleware/imageMulter.js";

const  router=express.Router();

router.get('/assets/:filename',getFrontendAssets);
router.post('/upload',upload.single("file"),addFrontendAssets);


export default router;
