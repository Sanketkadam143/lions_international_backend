import express from 'express';
import { getContact } from '../../controllers/superadmin/contact.js';
import superAuth from "../../middleware/superAdmin.js";

const router = express.Router();

router.get('/getContacts',superAuth, getContact);
export default router;