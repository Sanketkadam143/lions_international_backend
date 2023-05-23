import express from 'express';
import { getContact } from '../../controllers/superadmin/contact.js';

const router = express.Router();

router.get('/getContacts', getContact);
export default router;